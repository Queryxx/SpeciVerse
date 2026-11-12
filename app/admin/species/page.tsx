import type { Metadata } from "next";

import { SpeciesManager } from "@/components/admin/species/species-manager";
import { requireUser } from "@/lib/server/current-user";
import { listSpecies } from "@/lib/server/species-records";

export const metadata: Metadata = {
  title: "Species — SpeciVerse",
};

export default async function AdminSpeciesPage() {
  await requireUser();
  const species = await listSpecies();
  return <SpeciesManager initialSpecies={species} />;
}
