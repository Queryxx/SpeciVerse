import type { Role } from "@/lib/auth/types";

export const SESSION_COOKIE = "fieldnotes_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  sub: string;
  role: Role;
  exp: number;
};

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function jsonToBase64Url(value: unknown) {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

async function sign(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return bytesToBase64Url(new Uint8Array(signature));
}

function signaturesMatch(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  if (leftBytes.length !== rightBytes.length) return false;
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

export async function createSessionToken(userId: string, role: Role, secret: string) {
  const header = jsonToBase64Url({ alg: "HS256", typ: "JWT" });
  const payload = jsonToBase64Url({
    sub: userId,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  });
  const unsigned = `${header}.${payload}`;
  return `${unsigned}.${await sign(unsigned, secret)}`;
}

export async function readSessionToken(token: string, secret: string): Promise<SessionPayload | null> {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expected = await sign(`${header}.${payload}`, secret);
  if (!signaturesMatch(expected, signature)) return null;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Partial<SessionPayload>;
    if (!parsed.sub || (parsed.role !== "admin" && parsed.role !== "media") || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return { sub: parsed.sub, role: parsed.role, exp: parsed.exp };
  } catch {
    return null;
  }
}
