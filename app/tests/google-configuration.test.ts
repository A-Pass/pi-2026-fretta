import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { googleConfigurationIssue } from "../src/server/auth/google-configuration";
import { POST } from "../src/app/api/auth/[...all]/route";

const configuration = {
  DB_URL: "postgresql://localhost/test",
  APP_URL: "http://localhost:3002",
 APP_BETTER_AUTH_SECRET: "x".repeat(32),
 APP_GOOGLE_CLIENT_ID: "example-client",
 APP_GOOGLE_CLIENT_SECRET: "example-secret",
};

test("valida o endereço e o segredo do Google sem expor credenciais", () => {
  assert.equal(googleConfigurationIssue(configuration), null);
  assert.match(
    googleConfigurationIssue({ ...configuration, APP_URL: "abc" }) ??
      "",
    /APP_URL/,
  );
  assert.match(
    googleConfigurationIssue({
      ...configuration,
     APP_BETTER_AUTH_SECRET: "segredo-curto",
    }) ?? "",
    /32 caracteres/,
  );
});

test("login social sem credenciais devolve 503 com diagnóstico", async () => {
  const previous = process.env.APP_GOOGLE_CLIENT_ID;
  delete process.env.APP_GOOGLE_CLIENT_ID;
  try {
    const response = await POST(
      new NextRequest("http://localhost:3002/api/auth/sign-in/social", {
        method: "POST",
      }),
    );
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.code, "AUTH_NOT_CONFIGURED");
    assert.match(body.message, /Google authentication is not configured/);
  } finally {
    if (previous === undefined) delete process.env.APP_GOOGLE_CLIENT_ID;
    else process.env.APP_GOOGLE_CLIENT_ID = previous;
  }
});
