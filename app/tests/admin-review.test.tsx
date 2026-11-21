import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { AdminApp } from "../src/frontend/features/admin/AdminApp";
import { GET, POST } from "../src/app/api/v1/[...path]/route";
import { adminCredentialsConfigured } from "../src/server/admin-auth";
test("admin login never exposes local demo credentials or registrations", () => {
  const markup = renderToStaticMarkup(<AdminApp />);
  assert.match(markup, /Login administrativo/);
  assert.doesNotMatch(markup, /admin123|Carlos Almeida|Marina Souza/);
});
test("admin credentials require explicit credentials and a signing secret", () => {
  assert.equal(adminCredentialsConfigured({}), false);
  assert.equal(
    adminCredentialsConfigured({
      FRETTA_ADMIN_USERNAME: "operator",
      FRETTA_ADMIN_PASSWORD: "not-a-real-password",
    }),
    false,
  );
  assert.equal(
    adminCredentialsConfigured({
      FRETTA_ADMIN_USERNAME: "operator",
      FRETTA_ADMIN_PASSWORD: "not-a-real-password",
      FRETTA_ADMIN_SECRET: "a-test-secret",
    }),
    true,
  );
});
test("admin registration records and reviews require the authenticated admin cookie", async () => {
  const getResponse = await GET(
    new NextRequest("http://localhost/api/v1/admin/registrations"),
    { params: Promise.resolve({ path: ["admin", "registrations"] }) },
  );
  assert.equal(getResponse.status, 401);
  const documentResponse = await GET(
    new NextRequest(
      "http://localhost/api/v1/admin/registrations/user-1/documents",
    ),
    {
      params: Promise.resolve({
        path: ["admin", "registrations", "user-1", "documents"],
      }),
    },
  );
  assert.equal(documentResponse.status, 401);

  const postResponse = await POST(
    new NextRequest(
      "http://localhost/api/v1/admin/registrations/user-1/review",
      { method: "POST", body: JSON.stringify({ decision: "APROVADO" }) },
    ),
    {
      params: Promise.resolve({
        path: ["admin", "registrations", "user-1", "review"],
      }),
    },
  );
  assert.equal(postResponse.status, 401);
});
