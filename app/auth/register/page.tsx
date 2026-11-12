import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { listUsers } from "@/lib/server/users";

export const metadata: Metadata = {
  title: "Register — SpeciVerse",
};

export default async function RegisterPage() {
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs tracking-[0.16em] text-moss">FIELDNOTES STAFF</p>
        <h1 className="mt-2 font-serif text-4xl">Register</h1>
      </header>
      <RegisterForm registrationOpen={users.length === 0} />
    </div>
  );
}
