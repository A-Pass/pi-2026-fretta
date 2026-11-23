
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/server/generated/prisma/client";
import { freightOperation, FreightError } from "./service";

test("somente uma proposta pode ser aceita simultaneamente", async () => {
  // SEGURANÇA: executar somente no banco local de testes.
  const url = new URL(process.env.DB_URL!);

  assert.equal(url.pathname, "/fretta_test");
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname));

  const cliente_id = randomUUID();
  const motoristaAId = randomUUID();
  const motoristaBId = randomUUID();

  const motoristas = [motoristaAId, motoristaBId];
  const veiculosPorMotorista = new Map<string, string>();

  let frete_id: string | undefined;

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
      data: [cliente_id, ...motoristas].map((id) => ({
        id,
        name: id,
        email: `${id}@fretta.invalid`,
      })),
    });

    await prisma.cliente.create({
      data: {
        user_id: cliente_id,
      },
    });

    console.log("Cliente criado - OK");

    // 2. PREPARAR OS DOIS MOTORISTAS

    for (const motorista_id of motoristas) {
      await prisma.motorista.create({
        data: {
          user_id: motorista_id,
          codigo_publico: randomUUID(),
          atualizado_em: new Date(),
        },
      });

      const createdVehicle = await prisma.veiculo.create({
        data: {
          id: randomUUID(),
          motorista_id,
          categoria: "Utilitário",
          modelo: "Veículo de teste",
          placa: randomUUID(),
          categoria_porte: "PEQUENO",
          atualizado_em: new Date(),
        },
      });

      veiculosPorMotorista.set(motorista_id, createdVehicle.id);

      await prisma.cadastro_motorista.create({
        data: {
          id: randomUUID(),
          motorista_id,
          tipo_pessoa: "PF",
          cnh_numero: "teste",
          cnh_categoria: "B",
          cnh_validade: new Date("2099-01-01"),
          foto_perfil_id: randomUUID(),
          documento_cnh_id: randomUUID(),
          veiculo_id: createdVehicle.id,
          status: "APROVADO",
          atualizado_em: new Date(),
        },
      });

      await prisma.vinculo_assinatura.create({
        data: {
          id: randomUUID(),
          motorista_id,
          status: "ATIVA",
          inicio_em: new Date(Date.now() - 60000),
          fim_em: new Date(Date.now() + 2 * 86400000),
          atualizado_em: new Date(),
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

    const frete = await executar(cliente_id, "POST", [], {
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

    frete_id = frete.id;

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
      [frete_id, "propose"],
      {
        expectedUpdatedAt,
        priceCents: 22000,
        vehicleId: veiculosPorMotorista.get(motoristaAId),
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
      [frete_id, "propose"],
      {
        expectedUpdatedAt,
        priceCents: 25000,
        vehicleId: veiculosPorMotorista.get(motoristaBId),
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
        frete_id,
      },
    });

    assert.equal(quantidadePropostas, 2);

    console.log("Duas proposta registradas - OK");

    // 8. TESTE DE CONCORRÊNCIA
    //
    // O cliente tenta aceitar as duas proposta ao mesmo tempo.
    // Somente uma operação deve ser concluída.

    console.log("Iniciando duas tentativas simultâneas...");

    const resultados = await Promise.allSettled([
      executar(
        cliente_id,
        "POST",
        [frete_id, "accept", propostaAId],
        {
          offerId: ofertaAId,
        },
      ),

      executar(
        cliente_id,
        "POST",
        [frete_id, "accept", propostaBId],
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
        id: frete_id,
      },
      select: {
        status_frete_enum: true,
        proposta_aceita_id: true,
      },
    });

    assert.ok(freteAtualizado);

    assert.equal(freteAtualizado.status_frete_enum, "ACEITO");

    assert.ok(freteAtualizado.proposta_aceita_id);

    assert.ok(
      [propostaAId, propostaBId].includes(
        freteAtualizado.proposta_aceita_id,
      ),
    );

    // Somente uma proposta deve estar aceita.
    const propostasAceitas = await prisma.proposta.count({
      where: {
        frete_id,
        status_proposta: "ACEITA",
      },
    });

    assert.equal(
      propostasAceitas,
      1,
      "Deve existir somente uma proposta aceita.",
    );

    // Somente uma oferta deve estar aceita.
    const ofertasAceitas = await prisma.ofertaProposta.count({
      where: {
        proposta: {
          frete_id,
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

    if (frete_id) {
      const where = {
        frete_id,
      };

      // Desvincular a proposta aceita antes de excluí-la.
      await prisma.frete.update({
        where: {
          id: frete_id,
        },
        data: {
          proposta_aceita_id: null,
        },
      });

      const proposalRows = await prisma.proposta.findMany({
        where,
        select: { id: true },
      });
      const proposalIds = proposalRows.map((proposal) => proposal.id);
      await prisma.mensagem.deleteMany({
        where: { proposta_id: { in: proposalIds } },
      });
      await prisma.conversa.deleteMany({
        where: { proposta_id: { in: proposalIds } },
      });
      await prisma.ofertaProposta.deleteMany({ where: { proposta: where } });

      await prisma.proposta.deleteMany({
        where,
      });

      await prisma.frete.delete({
        where: {
          id: frete_id,
        },
      });
    }

    await prisma.vinculo_assinatura.deleteMany({
      where: {
        motorista_id: {
          in: motoristas,
        },
      },
    });

    await prisma.cadastro_motorista.deleteMany({
      where: {
        motorista_id: {
          in: motoristas,
        },
      },
    });

    await prisma.veiculo.deleteMany({
      where: {
        motorista_id: {
          in: motoristas,
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [cliente_id, ...motoristas],
        },
      },
    });

    await prisma.$disconnect();
  }
});
