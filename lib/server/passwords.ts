import { randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return { salt, hash: derived.toString("hex") };
}

const passwordAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function generatePassword(length = 12) {
  const required = [
    "ABCDEFGHJKLMNPQRSTUVWXYZ",
    "abcdefghijkmnopqrstuvwxyz",
    "23456789",
  ].map((chars) => chars[randomInt(chars.length)] ?? "A");
  const characters = [...required];

  while (characters.length < length) {
    characters.push(passwordAlphabet[randomInt(passwordAlphabet.length)] ?? "a");
  }

  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swap = randomInt(index + 1);
    const current = characters[index] ?? "a";
    characters[index] = characters[swap] ?? "a";
    characters[swap] = current;
  }

  return characters.join("");
}

export async function verifyPassword(password: string, salt: string, hash: string) {
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}
