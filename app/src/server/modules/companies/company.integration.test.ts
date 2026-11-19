import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  driverCanOffer,
  freightOperation,
  FreightError,
} from "../freights/service";
import { companyOperation, CompanyError } from "./service";

test("empresa convida por código, atribui e contrata com motorista sem assinatura pessoal", async () => {
  const url = new URL(process.env.DATABASE_URL!);
  assert.equal(url.pathname, "/fretta_test");
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname));
  const rollback = new Error("rollback");
  const flag = process.env.FRETTA_DEMO_PIX;
  try {
    process.env.FRETTA_DEMO_PIX = "true";
    await assert.rejects(
      prisma.$transaction(
        async (tx) => {
          const [manager, driver, customer, outsider, secondDriver, admin] =
            Array.from({ length: 6 }, () => randomUUID());
          await tx.user.createMany({
            data: [
              manager,
              driver,
              customer,
              outsider,
              secondDriver,
              admin,
            ].map((id, i) => ({
              id,
              name: `Teste ${i}`,
              papel: id === admin ? "ADMIN" : "USUARIO",
              email: `${id}@fretta.invalid`,
            })),
          });
          await tx.cliente.create({ data: { userId: customer } });
          const profile = await tx.motorista.create({
            data: { userId: driver },
          });
          const second = await tx.motorista.create({
            data: { userId: secondDriver },
          });
          const vehicle = await tx.veiculo.create({
            data: {
              motoristaId: driver,
              categoria: "Utilitário",
              modelo: "Veículo de teste",
              placa: randomUUID(),
            },
          });
          const company = (
            actor: string,
            action: string[],
            body: Record<string, unknown> = {},
            method = "POST",
          ) => companyOperation(tx, actor, method, action, body);
          const freight = (
            actor: string,
            action: string[],
            body: Record<string, unknown> = {},
            method = "POST",
            query = "",
          ) =>
            freightOperation(
              tx,
              actor,
              method,
              action,
              new URLSearchParams(query),
              body,
            );
          const denied = (status: number) => (error: unknown) =>
            (error instanceof CompanyError || error instanceof FreightError) &&
            error.status === status;

          const proof = await tx.arquivoUpload.create({
            data: {
              usuarioId: manager,
              finalidade: "company-proof",
              chaveArmazenamento: randomUUID(),
              mimeType: "image/jpeg",
              tamanhoBytes: 10,
            },
          });
          const registration = {
            documentId: proof.id,
            name: "Transportes de Ensaio",
            legalName: "Transportes Ltda.",
            cnpj: "11222333000181",
            contact: "Gestor Teste",
            email: "gestor@fretta.invalid",
          };
          const submitted = await company(manager, ["create"], registration);
          assert.ok("cadastroStatus" in submitted);
          assert.equal(submitted.cadastroStatus, "EM_ANALISE");
          await assert.rejects(
            company(manager, ["create-plan-payment"], { seats: 1 }),
            denied(409),
          );
          const record = await tx.empresa.findUniqueOrThrow({
            where: { gestorId: manager },
          });
          await assert.rejects(
            company(outsider, ["review", record.id], { approve: true }),
            denied(403),
          );
          await company(admin, ["review", record.id], {
            approve: false,
            reason: "Ajuste a razão social.",
            version: record.atualizadoEm.toISOString(),
          });
          await company(manager, ["edit"], {
            ...registration,
            legalName: "Transportes de Ensaio Ltda.",
          });
          const updated = await tx.empresa.findUniqueOrThrow({
            where: { id: record.id },
          });
          await company(admin, ["review", record.id], {
            approve: true,
            version: updated.atualizadoEm.toISOString(),
          });
          await assert.rejects(
            company(manager, ["invite"], { code: profile.codigoPublico }),
            denied(403),
          );
          const invoice = await company(manager, ["create-plan-payment"], {
            seats: 1,
          });
          assert.ok("code" in invoice);
          assert.equal(
            (await tx.empresa.findUniqueOrThrow({ where: { id: record.id } }))
              .vagas,
            0,
          );
          await assert.rejects(
            company(manager, ["confirm-plan-payment"], { id: "wrong" }),
            denied(409),
          );
          await company(manager, ["confirm-plan-payment"], { id: invoice.id });
          await assert.rejects(
            company(manager, ["confirm-plan-payment"], { id: invoice.id }),
            denied(409),
          );
          await company(manager, ["invite"], { code: profile.codigoPublico });
          await company(manager, ["invite"], { code: second.codigoPublico });
          const invites = await tx.conviteEmpresa.findMany({
            where: { motoristaId: { in: [driver, secondDriver] } },
          });
          const invitation = invites.find((row) => row.motoristaId === driver)!;
          await assert.rejects(
            company(outsider, ["respond-invite", invitation.id], {
              accept: true,
            }),
            denied(404),
          );
          const personal = await tx.frete.create({
            data: {
              clienteId: customer,
              titulo: "Frete autônomo já contratado",
              categoriaVeiculo: "Utilitário",
              origemSnapshot: {},
              destinoSnapshot: {},
            },
          });
          const personalProposal = await tx.proposta.create({
            data: {
              freteId: personal.id,
              motoristaId: driver,
              status: "ACEITA",
            },
          });
          await tx.frete.update({
            where: { id: personal.id },
            data: { status: "AGENDADO", propostaAceitaId: personalProposal.id },
          });
          await company(driver, ["respond-invite", invitation.id], {
            accept: true,
          });
          assert.equal(
            (await tx.frete.findUniqueOrThrow({ where: { id: personal.id } }))
              .status,
            "AGENDADO",
          );
          await freight(driver, [personal.id, "start"]);
          await freight(customer, [personal.id, "complete"]);
          assert.equal(
            (await tx.frete.findUniqueOrThrow({ where: { id: personal.id } }))
              .status,
            "CONCLUIDO",
          );
          await assert.rejects(
            company(
              secondDriver,
              [
                "respond-invite",
                invites.find((row) => row.motoristaId === secondDriver)!.id,
              ],
              { accept: true },
            ),
            denied(409),
          );
          assert.equal(
            await tx.vinculoAssinatura.count({
              where: { motoristaId: driver },
            }),
            0,
          );
          assert.equal(await driverCanOffer(tx, driver), false);

          const address = {
            city: "Eunápolis",
            state: "BA",
            neighborhood: "Centro",
            street: "Rua privada",
            number: "30",
            point: { lat: -16.377, lng: -39.58 },
          };
          const created = await freight(customer, [], {
            title: "Frete de empresa",
            description: "Caixas",
            vehicle: "Utilitário",
            pickup: address,
            delivery: address,
            schedule: { kind: "combinar" },
          });
          assert.ok("id" in created && "updatedAt" in created);
          const id = created.id;
          const nearby = await company(
            manager,
            ["opportunities"],
            { lat: "-16.377", lng: "-39.58", radius: "10" },
            "GET",
          );
          assert.ok(
            "items" in nearby &&
              nearby.items &&
              nearby.items.some((item) => item.id === id),
          );
          assert.doesNotMatch(
            JSON.stringify(nearby),
            /Rua privada|origemSnapshot|latitude|"lat"/,
          );
          const remote = await company(
            manager,
            ["opportunities"],
            { lat: "-18", lng: "-39.58", radius: "10" },
            "GET",
          );
          assert.ok(
            "items" in remote &&
              remote.items &&
              !remote.items.some((item) => item.id === id),
          );
          await assert.rejects(
            company(
              outsider,
              ["opportunities"],
              { lat: "-16.377", lng: "-39.58", radius: "10" },
              "GET",
            ),
            denied(403),
          );
          const assignmentData = {
            freightId: id,
            driverId: driver,
            vehicleId: vehicle.id,
          };
          await assert.rejects(
            company(manager, ["assign"], assignmentData),
            denied(422),
          );
          await tx.cadastroMotorista.create({
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
          await company(manager, ["assign"], assignmentData);
          const assignment = await tx.atribuicaoEmpresa.findFirstOrThrow({
            where: { freteId: id },
          });
          const workerHome = await company(driver, [], {}, "GET");
          assert.ok(
            "assignments" in workerHome &&
              workerHome.assignments?.some((item) => item.id === assignment.id),
          );
          assert.ok(
            "opportunities" in workerHome && !workerHome.opportunities?.length,
          );
          await assert.rejects(
            freight(
              driver,
              [],
              {},
              "GET",
              "role=motorista&lat=-16&lng=-39&radius=30",
            ),
            denied(403),
          );
          await assert.rejects(freight(outsider, [id], {}, "GET"), denied(404));
          const limited = await freight(driver, [id], {}, "GET");
          assert.ok("addresses" in limited && limited.addresses === undefined);

          const quote = {
            assignmentId: assignment.id,
            expectedUpdatedAt: created.updatedAt,
            priceCents: 25000,
            availableAt: new Date(Date.now() + 86400000).toISOString(),
            message: "Retiramos amanhã.",
          };
          await assert.rejects(
            freight(manager, [id, "company-propose"], quote),
            denied(403),
          );
          await assert.rejects(
            company(outsider, ["respond-assignment", assignment.id], {
              accept: true,
            }),
            denied(404),
          );
          await company(driver, ["respond-assignment", assignment.id], {
            accept: true,
          });
          await assert.rejects(
            freight(driver, [id, "company-propose"], quote),
            denied(403),
          );
          const revised = await freight(
            manager,
            [id, "company-propose"],
            quote,
          );
          assert.ok("proposals" in revised);
          const proposal = revised.proposals[0];
          assert.equal(proposal.companyName, "Transportes de Ensaio");
          assert.ok(proposal.conversationId);
          await freight(customer, [id, "accept", proposal.id], {
            offerId: proposal.offers[0].id,
          });
          await assert.rejects(company(driver, ["leave"]), denied(409));
          await assert.rejects(freight(manager, [id, "start"]), denied(403));
          await freight(driver, [id, "start"]);
          await freight(customer, [id, "complete"]);
          await company(driver, ["leave"]);
          assert.equal(
            await tx.vinculoEmpresa.count({ where: { motoristaId: driver } }),
            0,
          );
          throw rollback;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
          timeout: 20000,
        },
      ),
      (error) => error === rollback,
    );
  } finally {
    if (flag === undefined) delete process.env.FRETTA_DEMO_PIX;
    else process.env.FRETTA_DEMO_PIX = flag;
    await prisma.$disconnect();
  }
});
