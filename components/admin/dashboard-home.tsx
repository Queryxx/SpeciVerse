import Link from "next/link";

import type { PublicUser, UploadedSpecies } from "@/lib/auth/types";

type DashboardHomeProps = {
  user: PublicUser;
  userCount: number;
  species: UploadedSpecies[];
};

export function DashboardHome({ user, userCount, species }: DashboardHomeProps) {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <p className="text-xs tracking-[0.16em] text-moss">STAFF DESK</p>
        <h1 className="mt-2 font-serif text-4xl">Hello, {user.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {user.role === "admin"
            ? "You are signed in as an administrator. You can add staff and upload species."
            : "You are signed in as a media manager. You can upload species. Managing users is limited to administrators."}
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/species" className="rounded-md border border-border bg-card p-5 hover:bg-accent">
          <p className="text-xs tracking-[0.14em] text-muted-foreground">SPECIES RECORDS</p>
          <p className="mt-2 font-serif text-3xl">{species.length}</p>
        </Link>
        {user.role === "admin" ? (
          <Link href="/admin/users" className="rounded-md border border-border bg-card p-5 hover:bg-accent">
            <p className="text-xs tracking-[0.14em] text-muted-foreground">STAFF ACCOUNTS</p>
            <p className="mt-2 font-serif text-3xl">{userCount}</p>
          </Link>
        ) : (
          <div className="rounded-md border border-border bg-card p-5">
            <p className="text-xs tracking-[0.14em] text-muted-foreground">USER MANAGEMENT</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Restricted. Ask an administrator if a new staff account is needed.
            </p>
          </div>
        )}
      </div>
      <div>
        <h2 className="font-serif text-2xl">Recent uploads</h2>
        {species.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No species have been uploaded yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {species.slice(0, 4).map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
                <img src={item.image} alt="" className="size-14 rounded-md object-cover" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.scientific}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
