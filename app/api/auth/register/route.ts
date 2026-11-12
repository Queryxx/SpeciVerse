import { credentialsSchema } from "@/lib/server/schemas";
import { setSessionCookie } from "@/lib/server/current-user";
import { jsonError, toErrorResponse } from "@/lib/server/http";
import { registerFirstAdmin } from "@/lib/server/users";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid registration.", 400);

  try {
    const user = await registerFirstAdmin(parsed.data);
    await setSessionCookie(user);
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
