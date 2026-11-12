import type { PoolClient } from "pg";

import type { PublicUser, Role } from "@/lib/auth/types";
import { pool } from "@/lib/server/db";
import { StoreError } from "@/lib/server/errors";
import { hashPassword, verifyPassword } from "@/lib/server/passwords";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
  password_hash?: string;
  password_salt?: string;
};

type Queryable = Pick<PoolClient, "query">;

function toPublic(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at.toISOString(),
  };
}

function mapDatabaseError(error: unknown): never {
  if (error instanceof StoreError) throw error;

  const databaseError = error as { code?: string; message?: string };
  if (databaseError.code === "23505") {
    throw new StoreError("An account with that email already exists.", 409);
  }
  if (databaseError.code === "23503") {
    throw new StoreError("This person still has species records, so the account cannot be removed.", 400);
  }
  if (databaseError.code === "42P01") {
    throw new StoreError("The users table is missing. Apply db/schema.sql to the webspeci database.", 500);
  }
  if (databaseError.code === "3D000" || databaseError.code === "28P01" || databaseError.code === "ECONNREFUSED") {
    throw new StoreError("Cannot connect to the webspeci database. Check the DB settings in .env.local.", 500);
  }
  if (databaseError.message?.includes("last administrator")) {
    throw new StoreError("The last administrator cannot be removed or given another role.", 400);
  }

  throw error;
}

const publicColumns = "id, name, email, role, created_at";

export async function listUsers() {
  try {
    const result = await pool.query<UserRow>(
      `SELECT ${publicColumns} FROM users ORDER BY created_at ASC`,
    );
    return result.rows.map(toPublic);
  } catch (error) {
    mapDatabaseError(error);
  }
}

export async function findUserById(id: string) {
  try {
    const result = await pool.query<UserRow>(`SELECT ${publicColumns} FROM users WHERE id = $1`, [id]);
    const row = result.rows[0];
    return row ? toPublic(row) : null;
  } catch (error) {
    mapDatabaseError(error);
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const result = await pool.query<UserRow>(
      `SELECT ${publicColumns}, password_hash, password_salt FROM users WHERE email = $1`,
      [email.toLowerCase()],
    );
    const row = result.rows[0];
    if (!row?.password_hash || !row.password_salt) return null;
    const matches = await verifyPassword(password, row.password_salt, row.password_hash);
    return matches ? toPublic(row) : null;
  } catch (error) {
    mapDatabaseError(error);
  }
}

export async function registerFirstAdmin(input: { name: string; email: string; password: string }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("LOCK TABLE users IN EXCLUSIVE MODE");
    const count = await client.query<{ count: number }>("SELECT count(*)::int AS count FROM users");
    if ((count.rows[0]?.count ?? 0) > 0) {
      throw new StoreError("An administrator already exists. Ask an admin to create your account.", 403);
    }
    const user = await insertUser(client, { ...input, role: "admin" });
    await client.query("COMMIT");
    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    mapDatabaseError(error);
  } finally {
    client.release();
  }
}

export async function createStaffUser(input: { name: string; email: string; password: string; role: Role }) {
  try {
    return await insertUser(pool, input);
  } catch (error) {
    mapDatabaseError(error);
  }
}

async function insertUser(client: Queryable, input: { name: string; email: string; password: string; role: Role }) {
  const password = await hashPassword(input.password);
  const result = await client.query<UserRow>(
    `INSERT INTO users (name, email, password_hash, password_salt, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${publicColumns}`,
    [input.name.trim(), input.email.toLowerCase(), password.hash, password.salt, input.role],
  );
  const row = result.rows[0];
  if (!row) throw new StoreError("The account could not be created.", 500);
  return toPublic(row);
}

export async function updateUserRole(actorId: string, userId: string, role: Role) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query<UserRow>(`SELECT ${publicColumns} FROM users WHERE id = $1 FOR UPDATE`, [
      userId,
    ]);
    const user = current.rows[0];
    if (!user) throw new StoreError("User not found.", 404);
    if (user.id === actorId && role !== "admin") {
      throw new StoreError("You cannot remove your own administrator access.", 400);
    }

    const admins = await client.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM users WHERE role = 'admin'",
    );
    if (user.role === "admin" && role !== "admin" && (admins.rows[0]?.count ?? 0) <= 1) {
      throw new StoreError("The last administrator cannot be changed to another role.", 400);
    }

    const updated = await client.query<UserRow>(
      `UPDATE users SET role = $1 WHERE id = $2 RETURNING ${publicColumns}`,
      [role, userId],
    );
    await client.query("COMMIT");
    const row = updated.rows[0];
    if (!row) throw new StoreError("User not found.", 404);
    return toPublic(row);
  } catch (error) {
    await client.query("ROLLBACK");
    mapDatabaseError(error);
  } finally {
    client.release();
  }
}

export async function deleteUser(actorId: string, userId: string) {
  if (actorId === userId) throw new StoreError("You cannot delete your own account.", 400);

  try {
    const current = await pool.query<UserRow>(`SELECT ${publicColumns} FROM users WHERE id = $1`, [userId]);
    const user = current.rows[0];
    if (!user) throw new StoreError("User not found.", 404);

    if (user.role === "admin") {
      const admins = await pool.query<{ count: number }>(
        "SELECT count(*)::int AS count FROM users WHERE role = 'admin'",
      );
      if ((admins.rows[0]?.count ?? 0) <= 1) {
        throw new StoreError("The last administrator cannot be deleted.", 400);
      }
    }

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  } catch (error) {
    mapDatabaseError(error);
  }
}
