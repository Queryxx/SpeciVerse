import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Staff login — SpeciVerse",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs tracking-[0.16em] text-moss">FIELDNOTES STAFF</p>
        <h1 className="mt-2 font-serif text-4xl">Sign in</h1>
      </header>
      <LoginForm nextPath={safeNextPath(nextValue)} />
    </div>
  );
}
