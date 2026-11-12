import type { Metadata } from "next";

import { UserManager } from "@/components/admin/users/user-manager";
import { requireAdmin } from "@/lib/server/current-user";
import { listUsers } from "@/lib/server/users";

export const metadata: Metadata = {
  title: "Users — SpeciVerse",
};

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const users = await listUsers();
  return <UserManager currentUserId={admin.id} initialUsers={users} />;
}
