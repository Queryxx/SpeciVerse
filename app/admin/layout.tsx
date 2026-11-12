import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireUser } from "@/lib/server/current-user";

export const metadata: Metadata = {
  title: "Staff desk — SpeciVerse",
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
