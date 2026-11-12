"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterFormProps = {
  registrationOpen: boolean;
};

export function RegisterForm({ registrationOpen }: RegisterFormProps) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!registrationOpen) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          An administrator already exists. New staff accounts are created from the user directory, and only an
          administrator can open that page.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setPending(false);
      setError(body?.error ?? "Unable to register.");
      return;
    }

    window.location.assign("/admin");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <p className="text-sm leading-6 text-muted-foreground">
        This first account becomes the administrator. After that, the administrator adds media managers and other
        admins.
      </p>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create administrator"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link className="text-foreground underline-offset-4 hover:underline" href="/auth/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
