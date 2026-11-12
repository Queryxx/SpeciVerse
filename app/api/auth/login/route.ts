import { setSessionCookie } from "@/lib/server/current-user";
import { jsonError, toErrorResponse } from "@/lib/server/http";
import { loginSchema } from "@/lib/server/schemas";
import { authenticateUser } from "@/lib/server/users";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid login.", 400);

  try {
    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) return jsonError("Email or password is incorrect.", 401);
    await setSessionCookie(user);
    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
