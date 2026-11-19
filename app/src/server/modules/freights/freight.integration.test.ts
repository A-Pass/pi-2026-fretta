import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { freightOperation, FreightError } from "./service";
import {
  enviarMensagem,
  listarMensagens,
} from "../chat/services/message-service";

test("frete real separa contas e preserva negociação, aceite e avaliação", async () => {
  const url = new URL(process.env.DATABASE_URL!);
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
    await prisma.cliente.create({ data: { userId: client } });
    await prisma.motorista.create({ data: { userId: driver } });
    const vehicle = await prisma.veiculo.create({
      data: {
        motoristaId: driver,
        categoria: "Utilitário",
        modelo: "Veículo de teste",
        placa: randomUUID(),
      },
    });
    const availableAt = new Date(Date.now() + 86400000).toISOString();
    await prisma.cadastroMotorista.create({
      data: {
        motoristaId: driver,
        tipoPessoa: "PF",
        cnhNumero: "teste",
        cnhCategoria: "B",
        cnhValidade: new Date("2099-01-01"),
        fotoPerfilId: randomUUID(),
        documentoCnhId: randomUUID(),
        veiculoId: vehicle.id,
        status: "APROVADO",
      },
    });
    await prisma.vinculoAssinatura.create({
      data: {
        motoristaId: driver,
        status: "ATIVA",
        inicioEm: new Date(Date.now() - 1000),
        fimEm: new Date(availableAt),
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
    await prisma.cliente.create({ data: { userId: other } });
    const savedAddress = { ...address, label: "Casa" };
    await run(client, "POST", ["addresses", "save"], { address: savedAddress });
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
        address: savedAddress,
      }),
      denied(404),
    );
    await run(client, "POST", ["addresses", "save"], {
      id: saved[0].id,
      address: { ...savedAddress, label: "Trabalho" },
    });
    const updatedAddresses = await run(client, "GET", ["addresses"]);
    assert.ok(Array.isArray(updatedAddresses));
    assert.equal(updatedAddresses[0].label, "Trabalho");
    await run(client, "POST", ["addresses", "remove"], { id: saved[0].id });
    assert.deepEqual(await run(client, "GET", ["addresses"]), []);
    const request = {
      title: "Frete de teste",
      description: "Caixas",
      vehicle: "Utilitário",
      pickup: address,
      delivery: address,
      schedule: { kind: "combinar" },
    };
    const created = await run(client, "POST", [], request);
    assert.ok("id" in created);
    const id = (freightId = created.id);
    await assert.rejects(run(other, "GET", [id]), denied(404));
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
    await prisma.cliente.create({ data: { userId: driver } });
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
      message: "Posso buscar amanhã.",
    };
    const first = await run(driver, "POST", [id, "propose"], quote);
    assert.ok("proposals" in first);
    const proposal = first.proposals[0];
    const firstOffer = proposal.offers[0];
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
    });
    assert.ok("proposals" in revised);
    assert.equal(revised.proposals[0].conversationId, proposal.conversationId);
    await assert.rejects(
      run(client, "POST", [id, "accept", proposal.id], {
        offerId: firstOffer.id,
      }),
      denied(409),
    );
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
    const privateDetail = await run(driver, "GET", [id]);
    assert.ok("addresses" in privateDetail && privateDetail.addresses);
    await assert.rejects(run(other, "POST", [id, "start"]), denied(403));
    await run(driver, "POST", [id, "start"]);
    await run(client, "POST", [id, "complete"]);
    await run(client, "POST", [id, "reviews"], { score: 5 });
    await assert.rejects(
      run(client, "POST", [id, "reviews"], { score: 5 }),
      denied(409),
    );
  } finally {
    if (freightId) {
      const where = { freteId: freightId };
      await prisma.frete.update({
        where: { id: freightId },
        data: { propostaAceitaId: null },
      });
      await prisma.avaliacao.deleteMany({ where });
      await prisma.mensagem.deleteMany({
        where: { conversa: { proposta: where } },
      });
      await prisma.conversa.deleteMany({ where: { proposta: where } });
      await prisma.oferta.deleteMany({ where: { proposta: where } });
      await prisma.proposta.deleteMany({ where });
      await prisma.frete.delete({ where: { id: freightId } });
    }
    await prisma.vinculoAssinatura.deleteMany({
      where: { motoristaId: driver },
    });
    await prisma.cadastroMotorista.deleteMany({
      where: { motoristaId: driver },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [client, driver, other] } },
    });
    await prisma.$disconnect();
  }
});
