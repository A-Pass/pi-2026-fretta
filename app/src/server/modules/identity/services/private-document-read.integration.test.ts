import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { NextRequest } from "next/server";
import { prisma } from "../../../db/prisma";
import { GET } from "../../../../app/api/v1/driver/registration/documents/[id]/route";
test("documentos privados: dono e admin autorizados, terceiros e anônimos bloqueados", async () => {
  const url = new URL(process.env.DATABASE_URL!);
  assert.equal(url.pathname, "/fretta_test");
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname));
  const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
  });
  const users: { id: string; cookie: string }[] = [];
  const key = `${randomUUID()}.jpg`;
  const file = `storage/private/${key}`;
  try {
    for (let i = 0; i < 3; i++) {
      const response = await auth.api.signUpEmail({
        body: {
          name: "Teste privado",
          email: `${randomUUID()}@fretta.invalid`,
          password: "Test-only-password123!",
        },
        asResponse: true,
      });
      assert.equal(response.status, 200);
      users.push({
        id: (await response.json()).user.id,
        cookie: response.headers
          .getSetCookie()
          .map((c) => c.split(";")[0])
          .join("; "),
      });
    }
    await prisma.motorista.create({ data: { userId: users[0].id } });
    await prisma.user.update({
      where: { id: users[2].id },
      data: { papel: "ADMIN" },
    });
    const doc = await prisma.arquivoPrivado.create({
      data: {
        motoristaId: users[0].id,
        tipo: "CNH",
        chaveArmazenamento: key,
        mimeType: "image/jpeg",
        tamanhoBytes: 4,
      },
    });
    await mkdir("storage/private", { recursive: true });
    await writeFile(file, Buffer.from([255, 216, 255, 217]));
    const read = (cookie?: string) =>
      GET(
        new NextRequest(
          `http://localhost:3002/api/v1/driver/registration/documents/${doc.id}`,
          { headers: cookie ? { cookie } : {} },
        ),
        { params: Promise.resolve({ id: doc.id }) },
      );
    assert.equal((await read()).status, 401);
    assert.equal((await read(users[1].cookie)).status, 404);
    for (const u of [users[0], users[2]]) {
      const response = await read(u.cookie);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "private, no-store");
      assert.equal((await response.arrayBuffer()).byteLength, 4);
    }
    await unlink(file);
    assert.equal((await read(users[0].cookie)).status, 404);
  } finally {
    await unlink(file).catch(() => {});
    await prisma.user.deleteMany({
      where: { id: { in: users.map((u) => u.id) } },
    });
    await prisma.$disconnect();
  }
});
