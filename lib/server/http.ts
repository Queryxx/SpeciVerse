import { StoreError } from "@/lib/server/errors";

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export function toErrorResponse(error: unknown) {
  if (error instanceof StoreError) return jsonError(error.message, error.status);
  console.error(error);
  return jsonError("Something went wrong.", 500);
}
