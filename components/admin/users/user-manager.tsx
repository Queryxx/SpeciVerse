"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleLabel, roles, type PublicUser, type Role } from "@/lib/auth/types";

type UserManagerProps = {
  currentUserId: string;
  initialUsers: PublicUser[];
};

export function UserManager({ currentUserId, initialUsers }: UserManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [passwordMode, setPasswordMode] = useState<"generate" | "set">("generate");

  async function refresh() {
    const response = await fetch("/api/users");
    const body = (await response.json().catch(() => null)) as { users?: PublicUser[]; error?: string } | null;
    if (!response.ok || !body?.users) {
      setError(body?.error ?? "Unable to load users.");
      return;
    }
    setUsers(body.users);
  }

  async function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email,
        role: form.get("role"),
        passwordMode,
        password: passwordMode === "set" ? form.get("password") : undefined,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Unable to add that user.");
      return;
    }
    event.currentTarget.reset();
    setPasswordMode("generate");
    setNotice(`The password was sent to ${email}.`);
    await refresh();
  }

  async function onRoleChange(userId: string, role: Role) {
    setError("");
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(body?.error ?? "Unable to change that role.");
      return;
    }
    await refresh();
  }

  async function onDelete(userId: string) {
    setError("");
    const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(body?.error ?? "Unable to delete that user.");
      return;
    }
    await refresh();
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <p className="text-xs tracking-[0.16em] text-moss">ADMINISTRATORS ONLY</p>
        <h1 className="mt-2 font-serif text-4xl">Staff</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add a staff member by name, email, and role. Type a password or generate one. SpeciVerse emails that password
          to the address you enter. Media managers cannot open this page.
        </p>
      </header>

      <form className="grid gap-4 rounded-md border border-border bg-card p-5 md:grid-cols-2" onSubmit={onCreate}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Password</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="passwordMode"
              value="generate"
              checked={passwordMode === "generate"}
              onChange={() => setPasswordMode("generate")}
            />
            Generate a password
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="passwordMode"
              value="set"
              checked={passwordMode === "set"}
              onChange={() => setPasswordMode("set")}
            />
            I will choose the password
          </label>
          {passwordMode === "set" ? (
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-label="Password"
            />
          ) : (
            <p className="text-xs leading-5 text-muted-foreground">
              A password is created here and sent only by email.
            </p>
          )}
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            defaultValue="media"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabel(role)}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="text-sm text-destructive md:col-span-2">{error}</p> : null}
        {notice ? <p className="text-sm text-moss md:col-span-2">{notice}</p> : null}
        <Button type="submit" disabled={pending} className="md:col-span-2 md:w-fit">
          {pending ? "Adding…" : "Add user"}
        </Button>
      </form>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted text-xs tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">NAME</th>
              <th className="px-4 py-3 font-medium">EMAIL</th>
              <th className="px-4 py-3 font-medium">ROLE</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border bg-card">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Role for ${user.name}`}
                    value={user.role}
                    className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                    onChange={(event) => onRoleChange(user.id, event.target.value as Role)}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {roleLabel(role)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={user.id === currentUserId}
                    onClick={() => onDelete(user.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
