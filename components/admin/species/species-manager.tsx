"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { speciesCategories, speciesStatuses, type UploadedSpecies } from "@/lib/auth/types";

type SpeciesManagerProps = {
  initialSpecies: UploadedSpecies[];
};

export function SpeciesManager({ initialSpecies }: SpeciesManagerProps) {
  const [species, setSpecies] = useState(initialSpecies);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function refresh() {
    const response = await fetch("/api/species");
    const body = (await response.json().catch(() => null)) as { species?: UploadedSpecies[]; error?: string } | null;
    if (!response.ok || !body?.species) {
      setError(body?.error ?? "Unable to load species.");
      return;
    }
    setSpecies(body.species);
  }

  async function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const response = await fetch("/api/species", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Unable to upload that species.");
      return;
    }
    event.currentTarget.reset();
    await refresh();
  }

  async function onDelete(id: string) {
    setError("");
    const response = await fetch(`/api/species/${id}`, { method: "DELETE" });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(body?.error ?? "Unable to remove that species.");
      return;
    }
    await refresh();
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <p className="text-xs tracking-[0.16em] text-moss">MEDIA DESK</p>
        <h1 className="mt-2 font-serif text-4xl">Species</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Administrators and media managers can upload species portraits. These records stay in the staff library.
        </p>
      </header>

      <form className="grid gap-4 rounded-md border border-border bg-card p-5 md:grid-cols-2" onSubmit={onCreate}>
        <div className="space-y-2">
          <Label htmlFor="name">Common name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scientific">Scientific name</Label>
          <Input id="scientific" name="scientific" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue="Mammals"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {speciesCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue="Least concern"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {speciesStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="region">Region</Label>
          <Input id="region" name="region" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="introduction">Introduction</Label>
          <Textarea id="introduction" name="introduction" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Portrait</Label>
          <Input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
        </div>
        {error ? <p className="text-sm text-destructive md:col-span-2">{error}</p> : null}
        <Button type="submit" disabled={pending} className="md:col-span-2 md:w-fit">
          {pending ? "Uploading…" : "Upload species"}
        </Button>
      </form>

      {species.length === 0 ? (
        <p className="text-sm text-muted-foreground">No uploaded species yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {species.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-md border border-border bg-card">
              <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
              <div className="space-y-2 p-4">
                <div>
                  <h2 className="font-serif text-2xl">{item.name}</h2>
                  <p className="text-sm text-muted-foreground italic">{item.scientific}</p>
                </div>
                <p className="text-sm leading-6">{item.introduction}</p>
                <p className="text-xs tracking-[0.08em] text-muted-foreground">
                  {item.category} · {item.status} · {item.region}
                </p>
                <p className="text-xs text-muted-foreground">Added by {item.createdByName}</p>
                <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
