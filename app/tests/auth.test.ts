import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { GET } from "../src/app/api/auth/[...all]/route";
import { getAuthConfigurationError } from "../src/server/auth/env";

test("Google OAuth exige banco, segredo forte e credenciais do provedor", () => {
  assert.match(getAuthConfigurationError({}) ?? "", /DATABASE_URL/);

  const configuration = {
    DATABASE_URL: "postgresql://localhost/fretta",
    BETTER_AUTH_SECRET: "short",
    BETTER_AUTH_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: "client-id",
    GOOGLE_CLIENT_SECRET: "client-secret",
  };
  assert.match(
    getAuthConfigurationError(configuration) ?? "",
    /at least 32 characters/,
  );
  assert.equal(
    getAuthConfigurationError({
      ...configuration,
      BETTER_AUTH_SECRET: "x".repeat(32),
    }),
    null,
  );
});

test("endpoint OAuth informa configuração ausente sem iniciar sessão demonstrativa", async () => {
  const names = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];
  const previous = new Map(names.map((name) => [name, process.env[name]]));
  for (const name of names) delete process.env[name];

  try {
    const response = await GET(
      new NextRequest("http://localhost:3000/api/auth/get-session"),
    );
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "AUTH_NOT_CONFIGURED");
  } finally {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("Docker Compose encaminha as credenciais Google para o servidor", () => {
  const compose = readFileSync(
    new URL("../../docker-compose.yml", import.meta.url),
    "utf8",
  );

  assert.match(
    compose,
    /DATABASE_URL:\s+postgresql:\/\/\$\{DB_USER\}:\$\{DB_PASSWORD\}@database:5432\/\$\{DB_NAME\}/,
  );
  assert.match(compose, /condition:\s+service_healthy/);
  assert.match(compose, /BETTER_AUTH_URL:\s+\$\{APP_BETTER_AUTH_URL:-\}/);
  assert.match(compose, /BETTER_AUTH_SECRET:\s+\$\{APP_BETTER_AUTH_SECRET:-\}/);
  assert.match(compose, /GOOGLE_CLIENT_ID:\s+\$\{APP_GOOGLE_CLIENT_ID:-\}/);
  assert.match(compose, /GOOGLE_CLIENT_SECRET:\s+\$\{APP_GOOGLE_CLIENT_SECRET:-\}/);
});

test("migrações do Prisma são aplicadas antes de iniciar e incluem verification", () => {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { scripts: Record<string, string> };
  const migration = readFileSync(
    new URL(
      "../prisma/migrations/20261121024628_init/migration.sql",
      import.meta.url,
    ),
    "utf8",
  );

  assert.equal(packageJson.scripts.predev, "prisma migrate deploy");
  assert.equal(packageJson.scripts.prestart, "prisma migrate deploy");
  assert.match(migration, /CREATE TABLE "verification"/);
});
