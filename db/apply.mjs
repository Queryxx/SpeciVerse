import { readFileSync } from "node:fs";
import { Client } from "pg";

function loadEnv(file) {
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    env[line.slice(0, separator)] = line.slice(separator + 1);
  }
  return env;
}

const env = loadEnv(new URL("../.env.local", import.meta.url));
const name = env.DB_NAME ?? "";

if (!/^[a-z0-9_]+$/.test(name)) {
  throw new Error("DB_NAME must contain only lowercase letters, numbers, and underscores.");
}

const config = {
  host: env.DB_HOST,
  port: Number(env.DB_PORT ?? 5432),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
};

const admin = new Client({ ...config, database: "postgres" });
await admin.connect();
const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
if (exists.rowCount === 0) {
  await admin.query(`CREATE DATABASE ${name}`);
  console.log("created database");
} else {
  console.log("database exists");
}
await admin.end();

const database = new Client({ ...config, database: name });
await database.connect();
const table = await database.query("SELECT to_regclass('public.users') AS name");
if (!table.rows[0]?.name) {
  await database.query(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
  console.log("applied schema");
} else {
  console.log("schema already present");
}
await database.end();
