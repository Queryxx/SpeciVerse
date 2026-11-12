"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/auth/login");
  }

  return (
    <Button variant="outline" className="w-full" onClick={logout} disabled={pending}>
      {pending ? "Signing out…" : "Log out"}
    </Button>
  );
}
