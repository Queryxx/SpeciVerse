import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/server/current-user";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-md border border-border bg-card p-8 shadow-sm">{children}</div>
    </div>
  );
}
