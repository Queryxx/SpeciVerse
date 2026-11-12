import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { PublicUser } from "@/lib/auth/types";
import { createSessionToken, readSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/token";
import { StoreError } from "@/lib/server/errors";
import { findUserById } from "@/lib/server/users";

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new StoreError("AUTH_SECRET is not set.", 500);
  return secret;
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;

  const session = await readSessionToken(token, secret);
  if (!session) return null;
  return findUserById(session.sub);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}

export async function setSessionCookie(user: PublicUser) {
  const token = await createSessionToken(user.id, user.role, authSecret());
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
