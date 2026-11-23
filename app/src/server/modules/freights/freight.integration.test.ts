import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/server/generated/prisma/client";
import { listScheduledPickups, registerDuePickups } from "./pickups";
import { freightOperation, FreightError } from "./service";
import {
  enviarMensagem,
  listarMensagens,
} from "../chat/services/message-service";

test("frete real separa contas e preserva negociação, aceite e avaliação", async () => {
  const url = new URL(process.env.DB_URL!);
  assert.equal(url.pathname, "/fretta_test");
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname));
  const [client, driver, other] = [randomUUID(), randomUUID(), randomUUID()];
  let freightId: string | undefined;
  const run = (
    user: string,
    method: string,
    segments: string[],
    body = {},
    query = "",
  ) =>
    prisma.$transaction(
      (tx) =>
        freightOperation(
          tx,
          user,
          method,
          segments,
          new URLSearchParams(query),
          body,
        ),
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  const denied = (status: number) => (error: unknown) =>
    error instanceof FreightError && error.status === status;
  try {
    await prisma.user.createMany({
      data: [client, driver, other].map((id) => ({
        id,
        name: id,
        email: `${id}@fretta.invalid`,
      })),
    });
    await prisma.motorista.create({
      data: {
        user_id: driver,
        codigo_publico: randomUUID(),
        atualizado_em: new Date(),
      },
    });
    const vehicle = await prisma.veiculo.create({
      data: {
        id: randomUUID(),
        motorista_id: driver,
        categoria: "Utilitário",
        modelo: "Veículo de teste",
        placa: randomUUID(),
        categoria_porte: "PEQUENO",
        atualizado_em: new Date(),
      },
    });
    const availableAt = new Date(Date.now() + 86400000).toISOString();
    await prisma.cadastro_motorista.create({
      data: {
        id: randomUUID(),
        motorista_id: driver,
        tipo_pessoa: "PF",
        cnh_numero: "teste",
        cnh_categoria: "B",
        cnh_validade: new Date("2099-01-01"),
        foto_perfil_id: randomUUID(),
        documento_cnh_id: randomUUID(),
        veiculo_id: vehicle.id,
        status: "APROVADO",
        atualizado_em: new Date(),
      },
    });
    await prisma.vinculo_assinatura.create({
      data: {
        id: randomUUID(),
        motorista_id: driver,
        status: "ATIVA",
        inicio_em: new Date(Date.now() - 1000),
        fim_em: new Date(availableAt),
        atualizado_em: new Date(),
      },
    });
    const address = {
      city: "Eunápolis",
      state: "BA",
      neighborhood: "Centro",
      street: "Rua privada",
      number: "30",
      point: { lat: -16.377, lng: -39.58 },
    };
    await prisma.cliente.create({ data: { user_id: other } });
    const request = {
      title: "Frete de teste",
      description: "Caixas",
      vehicle: "Utilitário",
      pickup: address,
      delivery: address,
      schedule: { kind: "combinar" },
    };
    assert.equal(
      await prisma.cliente.findUnique({ where: { user_id: client } }),
      null,
    );
    const created = await run(client, "POST", [], request);
    assert.ok("id" in created);
    assert.ok(await prisma.cliente.findUnique({ where: { user_id: client } }));
    const id = (freightId = created.id);
    await assert.rejects(run(other, "GET", [id]), denied(404));
    const endereco_salvos = { ...address, label: "Casa" };
    await run(client, "POST", ["addresses", "save"], { address: endereco_salvos });
    const saved = await run(client, "GET", ["addresses"]);
    assert.ok(Array.isArray(saved) && saved.length === 1);
    assert.deepEqual(await run(other, "GET", ["addresses"]), []);
    await assert.rejects(
      run(other, "POST", ["addresses", "remove"], { id: saved[0].id }),
      denied(404),
    );
    await assert.rejects(
      run(other, "POST", ["addresses", "save"], {
        id: saved[0].id,
        address: endereco_salvos,
      }),
      denied(404),
    );
    await run(client, "POST", ["addresses", "save"], {
      id: saved[0].id,
      address: { ...endereco_salvos, label: "Trabalho" },
    });
    const updatedAddresses = await run(client, "GET", ["addresses"]);
    assert.ok(Array.isArray(updatedAddresses));
    assert.equal(updatedAddresses[0].label, "Trabalho");
    await run(client, "POST", ["addresses", "remove"], { id: saved[0].id });
    assert.deepEqual(await run(client, "GET", ["addresses"]), []);
    const feed = await run(
      driver,
      "GET",
      [],
      {},
      "role=motorista&lat=-16.377&lng=-39.58&radius=30",
    );
    assert.ok("items" in feed && feed.items?.some((item) => item.id === id));
    const far = await run(
      driver,
      "GET",
      [],
      {},
      "role=motorista&lat=0&lng=0&radius=30",
    );
    assert.ok(
      "items" in far && far.items && !far.items.some((item) => item.id === id),
    );
    await prisma.cliente.create({ data: { user_id: driver } });
    const own = await run(driver, "POST", [], request);
    assert.ok("id" in own);
    try {
      const ownFeed = await run(
        driver,
        "GET",
        [],
        {},
        "role=motorista&lat=-16.377&lng=-39.58&radius=30",
      );
      assert.ok(
        "items" in ownFeed &&
          ownFeed.items?.some((item) => item.id === own.id && item.ownRequest),
      );
      const outside = await run(
        driver,
        "GET",
        [],
        {},
        "role=motorista&lat=0&lng=0&radius=30",
      );
      assert.ok(
        "items" in outside &&
          outside.items &&
          !outside.items.some((item) => item.id === own.id),
      );
      await assert.rejects(
        run(driver, "POST", [own.id, "propose"]),
        denied(403),
      );
    } finally {
      await prisma.frete.delete({ where: { id: own.id } });
    }
    const publicDetail = await run(driver, "GET", [id]);
    assert.ok(
      "addresses" in publicDetail && publicDetail.addresses === undefined,
    );
    const quote = {
      expectedUpdatedAt: "updatedAt" in created ? created.updatedAt : undefined,
      priceCents: 22000,
      vehicleId: vehicle.id,
      availableAt,
      message: "",
    };
    const first = await run(driver, "POST", [id, "propose"], quote);
    assert.ok("proposals" in first);
    const proposal = first.proposals[0];
    const firstOffer = proposal.offers[0];
    assert.equal(firstOffer.message, "");
    await run(client, "POST", [id, "decline", proposal.id], {
      offerId: firstOffer.id,
    });
    assert.ok(proposal.conversationId);
    await enviarMensagem(proposal.conversationId, driver, {
      text: "Podemos combinar?",
      clientMessageId: randomUUID(),
    });
    assert.equal(
      (await listarMensagens(proposal.conversationId, client)).items.length,
      1,
    );
    await assert.rejects(listarMensagens(proposal.conversationId, other));
    const revised = await run(driver, "POST", [id, "propose"], {
      ...quote,
      priceCents: 21000,
      message: "   ",
    });
    assert.ok("proposals" in revised);
    assert.equal(revised.proposals[0].conversationId, proposal.conversationId);
    await assert.rejects(
      run(client, "POST", [id, "accept", proposal.id], {
        offerId: firstOffer.id,
      }),
      denied(409),
    );
    assert.equal(revised.proposals[0].offers[0].message, "");
    const outdated = revised.proposals[0].offers[0].id;
    const edited = await run(client, "POST", [id, "edit"], {
      ...request,
      title: "Frete atualizado",
      expectedUpdatedAt: quote.expectedUpdatedAt,
    });
    assert.ok("updatedAt" in edited);
    await assert.rejects(
      run(client, "POST", [id, "accept", proposal.id], { offerId: outdated }),
      denied(409),
    );
    await assert.rejects(
      run(driver, "POST", [id, "propose"], quote),
      denied(409),
    );
    const latest = await run(driver, "POST", [id, "propose"], {
      ...quote,
      expectedUpdatedAt: edited.updatedAt,
    });
    assert.ok("proposals" in latest);
    const offerId = latest.proposals[0].offers[0].id;
    await run(client, "POST", [id, "accept", proposal.id], { offerId });
    await run(client, "POST", [id, "accept", proposal.id], { offerId });
    assert.equal(
      (await listScheduledPickups(prisma, driver)).find(
        (pickup) => pickup.id === id,
      )?.pickupAt,
      availableAt,
    );
    assert.deepEqual(await listScheduledPickups(prisma, other), []);
    const reminder = { id: `pickup-due:${offerId}`, destinatario_id: driver };
    await registerDuePickups(
      prisma,
      driver,
      new Date(Date.parse(availableAt) - 1),
    );
    assert.equal(await prisma.notificacao.count({ where: reminder }), 0);
    await registerDuePickups(prisma, driver, new Date(availableAt));
    await registerDuePickups(prisma, driver, new Date(availableAt));
    assert.equal(await prisma.notificacao.count({ where: reminder }), 1);
    const clientList = await run(client, "GET", []);
    assert.ok(
      "items" in clientList &&
        clientList.items?.some(
          (item) =>
            "agreement" in item &&
            item.id === id &&
            item.agreement?.conversationId === proposal.conversationId,
        ),
    );
    const privateDetail = await run(driver, "GET", [id]);
    assert.ok("addresses" in privateDetail && privateDetail.addresses);
    await assert.rejects(run(other, "POST", [id, "start"]), denied(403));
    await run(driver, "POST", [id, "start"]);
    assert.equal(
      (await listScheduledPickups(prisma, driver)).some(
        (pickup) => pickup.id === id,
      ),
      false,
    );
    await assert.rejects(
      run(client, "POST", [id, "complete"], { score: 5 }),
      denied(422),
    );
    await assert.rejects(
      run(other, "POST", [id, "complete"], { score: 5 }),
      denied(403),
    );
    await prisma.ofertaProposta.update({
      where: { id: offerId },
      data: { disponivelEm: new Date(Date.now() - 60_000) },
    });
    await assert.rejects(run(client, "POST", [id, "complete"]), denied(422));
    const waiting = await run(client, "POST", [id, "complete"], { score: 5 });
    assert.ok("status" in waiting && waiting.status === "EM_TRANSPORTE");
    await run(client, "POST", [id, "complete"], { score: 1 });
    const finished = await run(driver, "POST", [id, "complete"], { score: 4 });
    assert.ok("status" in finished && finished.status === "CONCLUIDO");
    const ratings = await prisma.avaliacao.findMany({ where: { frete_id: id } });
    assert.equal(ratings.length, 2);
    assert.equal(
      ratings.find((rating) => rating.avaliado_id === driver)?.nota,
      5,
    );
    assert.equal(
      ratings.find((rating) => rating.avaliado_id === client)?.nota,
      4,
    );
    await assert.rejects(
      run(client, "POST", [id, "reviews"], { score: 5 }),
      denied(409),
    );
  } finally {
    if (freightId) {
      const where = { frete_id: freightId };
      await prisma.frete.update({
        where: { id: freightId },
        data: { proposta_aceita_id: null },
      });
      await prisma.avaliacao.deleteMany({ where });
      await prisma.mensagem.deleteMany({ where });
      await prisma.conversa.deleteMany({
        where: { proposta_id: { in: (await prisma.proposta.findMany({ where, select: { id: true } })).map((row) => row.id) } },
      });
      await prisma.ofertaProposta.deleteMany({ where: { proposta: where } });
      await prisma.proposta.deleteMany({ where });
      await prisma.frete.delete({ where: { id: freightId } });
    }
    await prisma.vinculo_assinatura.deleteMany({
      where: { motorista_id: driver },
    });
    await prisma.cadastro_motorista.deleteMany({
      where: { motorista_id: driver },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [client, driver, other] } },
    });
    await prisma.$disconnect();
  }
});
