import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & { pgPool?: Pool };

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

export const pool =
  globalForPg.pgPool ??
  new Pool({
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 5432),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_NAME"),
  });

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;
