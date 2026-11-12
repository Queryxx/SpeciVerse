import type { PublicUser } from "@/lib/auth/types";
import { getCurrentUser } from "@/lib/server/current-user";
import { jsonError } from "@/lib/server/http";

export async function requireApiUser(): Promise<PublicUser | Response> {
  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in required.", 401);
  return user;
}

export async function requireApiAdmin(): Promise<PublicUser | Response> {
  const user = await requireApiUser();
  if (user instanceof Response) return user;
  if (user.role !== "admin") return jsonError("Only an administrator can manage users.", 403);
  return user;
}
