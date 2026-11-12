"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, LayoutDashboard, Users } from "lucide-react";

import { SpeciverseMark } from "@/components/brand/speciverse-mark";

import { LogoutButton } from "@/components/admin/logout-button";
import { roleLabel, type PublicUser } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  user: PublicUser;
  children: React.ReactNode;
};

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/species", label: "Species", icon: Images },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[250px_1fr]">
      <aside className="flex flex-col gap-8 border-b border-border bg-card px-5 py-6 md:min-h-screen md:border-r md:border-b-0">
        <Link href="/admin" className="inline-flex items-center gap-2 text-forest">
          <SpeciverseMark className="size-8" />
          <span className="font-serif text-base tracking-tight">
            Speci<em className="text-moss">Verse</em>
          </span>
        </Link>
        <nav className="flex gap-2 md:flex-col" aria-label="Admin">
          {links
            .filter((link) => !link.adminOnly || user.role === "admin")
            .map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
        </nav>
        <div className="mt-auto space-y-3">
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{roleLabel(user.role)}</p>
          </div>
          <LogoutButton />
          <Link href="/" className="block text-xs text-muted-foreground underline-offset-4 hover:underline">
            View the field guide
          </Link>
        </div>
      </aside>
      <div className="px-5 py-8 md:px-10">{children}</div>
    </div>
  );
}
