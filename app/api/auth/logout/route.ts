import { clearSessionCookie } from "@/lib/server/current-user";

export async function POST() {
  await clearSessionCookie();
  return Response.json({ ok: true });
}
