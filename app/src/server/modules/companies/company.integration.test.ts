import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/server/generated/prisma/client";
import { companyOperation, CompanyError } from "./service";

test("company registration uses current Prisma model fields", async () => {
  const url = new URL(process.env.DB_URL!);
  assert.equal(url.pathname, "/fretta_test");
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname));

  const rollback = new Error("rollback");
  try {
    await assert.rejects(
      prisma.$transaction(
        async (tx) => {
          const manager = randomUUID();
          const admin = randomUUID();
          await tx.user.createMany({
            data: [
              {
                id: manager,
                name: "Gestor de teste",
                email: `${manager}@fretta.invalid`,
              },
              {
                id: admin,
                name: "Admin de teste",
                email: `${admin}@fretta.invalid`,
                papel: "ADMIN",
              },
            ],
          });
          const proof = await tx.arquivo_upload.create({
            data: {
              id: randomUUID(),
              usuario_id: manager,
              finalidade: "company-proof",
              chave_armazenamento: `${randomUUID()}.jpg`,
              mime_type: "image/jpeg",
              tamanho_bytes: 10,
            },
          });
          const run = (
            actor: string,
            parts: string[],
            body: Record<string, unknown> = {},
          ) => companyOperation(tx, actor, "POST", parts, body);
          const registration = {
            documentId: proof.id,
            name: "Transportes de Ensaio",
            legalName: "Transportes de Ensaio Ltda.",
            cnpj: "11222333000181",
            contact: "Gestor Teste",
            email: "gestor@fretta.invalid",
          };

          const created = await run(manager, ["create"], registration);
          assert.ok("cadastro_status" in created);
          assert.equal(created.cadastro_status, "EM_ANALISE");

          const company = await tx.empresa.findUniqueOrThrow({
            where: { gestor_id: manager },
          });
          await run(admin, ["review", company.id], {
            approve: true,
            version: company.atualizado_em.toISOString(),
          });
          await assert.rejects(
            run(manager, ["create-plan-payment"], { seats: 1 }),
            (error: unknown) =>
              error instanceof CompanyError && error.status === 501,
          );
          throw rollback;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      ),
      (error) => error === rollback,
    );
  } finally {
    await prisma.$disconnect();
  }
});
