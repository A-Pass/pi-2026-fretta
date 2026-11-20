
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { freightOperation, FreightError } from "./service";

test("somente uma proposta pode ser aceita simultaneamente", async () => {
  // SEGURANÇA: executar somente no banco local de testes.
  const url = new URL(process.env.DATABASE_URL!);

  assert.equal(url.pathname, "/fretta_test");
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname));

  const clienteId = randomUUID();
  const motoristaAId = randomUUID();
  const motoristaBId = randomUUID();

  const motoristas = [motoristaAId, motoristaBId];
  const veiculos = new Map<string, string>();

  let freteId: string | undefined;

  // Usar transações com isolamento Serializable,
  // assim como a API do projeto.
  const executar = (
    usuarioId: string,
    metodo: string,
    segmentos: string[],
    dados: Record<string, unknown> = {},
  ) =>
    prisma.$transaction(
      (tx) =>
        freightOperation(
          tx,
          usuarioId,
          metodo,
          segmentos,
          new URLSearchParams(),
          dados,
        ),
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

  try {
    // 1. CRIAR CLIENTE E MOTORISTAS

    await prisma.user.createMany({
      data: [clienteId, ...motoristas].map((id) => ({
        id,
        name: id,
        email: `${id}@fretta.invalid`,
      })),
    });

    await prisma.cliente.create({
      data: {
        userId: clienteId,
      },
    });

    console.log("Cliente criado - OK");

    // 2. PREPARAR OS DOIS MOTORISTAS

    for (const motoristaId of motoristas) {
      await prisma.motorista.create({
        data: {
          userId: motoristaId,
        },
      });

      const veiculo = await prisma.veiculo.create({
        data: {
          motoristaId,
          categoria: "Utilitário",
          modelo: "Veículo de teste",
          placa: randomUUID(),
        },
      });

      veiculos.set(motoristaId, veiculo.id);

      await prisma.cadastroMotorista.create({
        data: {
          motoristaId,
          tipoPessoa: "PF",
          cnhNumero: "teste",
          cnhCategoria: "B",
          cnhValidade: new Date("2099-01-01"),
          fotoPerfilId: randomUUID(),
          documentoCnhId: randomUUID(),
          veiculoId: veiculo.id,
          status: "APROVADO",
        },
      });

      await prisma.vinculoAssinatura.create({
        data: {
          motoristaId,
          status: "ATIVA",
          inicioEm: new Date(Date.now() - 60000),
          fimEm: new Date(Date.now() + 2 * 86400000),
        },
      });
    }

    console.log("Dois motoristas preparados - OK");

    // 3. CRIAR O FRETE

    const endereco = {
      city: "Eunápolis",
      state: "BA",
      neighborhood: "Centro",
      street: "Rua de teste",
      number: "30",
      point: {
        lat: -16.377,
        lng: -39.58,
      },
    };

    const frete = await executar(clienteId, "POST", [], {
      title: "Frete para teste de concorrência",
      description: "Transporte de caixas",
      vehicle: "Utilitário",
      pickup: endereco,
      delivery: endereco,
      schedule: {
        kind: "combinar",
      },
    });

    assert.ok("id" in frete);

    freteId = frete.id;

    console.log("Frete criado - OK");

    // 4. DEFINIR DISPONIBILIDADE

    const availableAt = new Date(
      Date.now() + 86400000,
    ).toISOString();

    const expectedUpdatedAt =
      "updatedAt" in frete ? frete.updatedAt : undefined;

    // 5. MOTORISTA A ENVIA PROPOSTA

    const propostaA = await executar(
      motoristaAId,
      "POST",
      [freteId, "propose"],
      {
        expectedUpdatedAt,
        priceCents: 22000,
        vehicleId: veiculos.get(motoristaAId),
        availableAt,
        message: "Proposta do motorista A.",
      },
    );

    assert.ok("proposals" in propostaA);
    assert.ok(propostaA.proposals[0]?.id);
    assert.ok(propostaA.proposals[0]?.offers[0]?.id);

    console.log("Proposta do motorista A criada - OK");

    // 6. MOTORISTA B ENVIA PROPOSTA

    const propostaB = await executar(
      motoristaBId,
      "POST",
      [freteId, "propose"],
      {
        expectedUpdatedAt,
        priceCents: 25000,
        vehicleId: veiculos.get(motoristaBId),
        availableAt,
        message: "Proposta do motorista B.",
      },
    );

    assert.ok("proposals" in propostaB);
    assert.ok(propostaB.proposals[0]?.id);
    assert.ok(propostaB.proposals[0]?.offers[0]?.id);

    console.log("Proposta do motorista B criada - OK");

    // 7. CONFIRMAR AS DUAS PROPOSTAS

    const propostaAId = propostaA.proposals[0].id;
    const propostaBId = propostaB.proposals[0].id;

    const ofertaAId = propostaA.proposals[0].offers[0].id;
    const ofertaBId = propostaB.proposals[0].offers[0].id;

    assert.notEqual(propostaAId, propostaBId);
    assert.notEqual(ofertaAId, ofertaBId);

    const quantidadePropostas = await prisma.proposta.count({
      where: {
        freteId,
      },
    });

    assert.equal(quantidadePropostas, 2);

    console.log("Duas propostas registradas - OK");

    // 8. TESTE DE CONCORRÊNCIA
    //
    // O cliente tenta aceitar as duas propostas ao mesmo tempo.
    // Somente uma operação deve ser concluída.

    console.log("Iniciando duas tentativas simultâneas...");

    const resultados = await Promise.allSettled([
      executar(
        clienteId,
        "POST",
        [freteId, "accept", propostaAId],
        {
          offerId: ofertaAId,
        },
      ),

      executar(
        clienteId,
        "POST",
        [freteId, "accept", propostaBId],
        {
          offerId: ofertaBId,
        },
      ),
    ]);

    // 9. VERIFICAR O RESULTADO DAS OPERAÇÕES

    const sucessos = resultados.filter(
      (resultado) => resultado.status === "fulfilled",
    );

    const falhas = resultados.filter(
      (resultado) => resultado.status === "rejected",
    );

    assert.equal(
      sucessos.length,
      1,
      "Exatamente uma contratação deve ser concluída.",
    );

    assert.equal(
      falhas.length,
      1,
      "A segunda contratação deve ser rejeitada.",
    );

    // A falha pode ser uma regra de negócio (409)
    // ou um conflito de transação Serializable (P2034).
    const falha = resultados.find(
      (resultado): resultado is PromiseRejectedResult =>
        resultado.status === "rejected",
    );

    assert.ok(falha);

    const motivo = falha.reason;

    const conflitoDeNegocio =
      motivo instanceof FreightError &&
      motivo.status === 409;

    const conflitoDeBanco =
      typeof motivo === "object" &&
      motivo !== null &&
      "code" in motivo &&
      ["P2034", "P2002"].includes(String(motivo.code));

    assert.ok(
      conflitoDeNegocio || conflitoDeBanco,
      "A operação rejeitada deve indicar conflito.",
    );

    console.log("Uma contratação concluída - OK");
    console.log("Segunda contratação rejeitada - OK");

    // 10. VERIFICAR O ESTADO REAL NO POSTGRESQL

    const freteAtualizado = await prisma.frete.findUnique({
      where: {
        id: freteId,
      },
      select: {
        status: true,
        propostaAceitaId: true,
      },
    });

    assert.ok(freteAtualizado);

    assert.equal(freteAtualizado.status, "AGENDADO");

    assert.ok(freteAtualizado.propostaAceitaId);

    assert.ok(
      [propostaAId, propostaBId].includes(
        freteAtualizado.propostaAceitaId,
      ),
    );

    // Somente uma proposta deve estar aceita.
    const propostasAceitas = await prisma.proposta.count({
      where: {
        freteId,
        status: "ACEITA",
      },
    });

    assert.equal(
      propostasAceitas,
      1,
      "Deve existir somente uma proposta aceita.",
    );

    // Somente uma oferta deve estar aceita.
    const ofertasAceitas = await prisma.oferta.count({
      where: {
        proposta: {
          freteId,
        },
        status: "ACEITA",
      },
    });

    assert.equal(
      ofertasAceitas,
      1,
      "Deve existir somente uma oferta aceita.",
    );

    console.log("Frete atualizado para AGENDADO - OK");
    console.log("Apenas uma proposta aceita no banco - OK");
    console.log("Apenas uma oferta aceita no banco - OK");
    console.log("Teste de concorrência concluído - OK");
  } finally {
    // 11. LIMPAR OS DADOS DO TESTE

    if (freteId) {
      const where = {
        freteId,
      };

      // Desvincular a proposta aceita antes de excluí-la.
      await prisma.frete.update({
        where: {
          id: freteId,
        },
        data: {
          propostaAceitaId: null,
        },
      });

      await prisma.mensagem.deleteMany({
        where: {
          conversa: {
            proposta: where,
          },
        },
      });

      await prisma.oferta.deleteMany({
        where: {
          proposta: where,
        },
      });

      await prisma.conversa.deleteMany({
        where: {
          proposta: where,
        },
      });

      await prisma.proposta.deleteMany({
        where,
      });

      await prisma.frete.delete({
        where: {
          id: freteId,
        },
      });
    }

    await prisma.vinculoAssinatura.deleteMany({
      where: {
        motoristaId: {
          in: motoristas,
        },
      },
    });

    await prisma.cadastroMotorista.deleteMany({
      where: {
        motoristaId: {
          in: motoristas,
        },
      },
    });

    await prisma.veiculo.deleteMany({
      where: {
        motoristaId: {
          in: motoristas,
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [clienteId, ...motoristas],
        },
      },
    });

    await prisma.$disconnect();
  }
});
