export async function GET() {
  return Response.json(
    {
      code: "NOT_IMPLEMENTED",
      message: "API real ainda não implementada. Consulte docs/api.md.",
    },
    { status: 501 },
  );
}
export const POST = GET;
export const PATCH = GET;
export const DELETE = GET;
