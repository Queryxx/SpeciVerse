import type { Metadata } from "next";

import { SpeciesWall } from "@/components/guide/species-wall";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { species } from "@/data/species";

export const metadata: Metadata = {
  title: "All species — SpeciVerse",
  description: "Every species recorded in the living field guide.",
};

export default function AllSpeciesPage() {
  return (
    <main className="field-guide min-h-screen">
      <SiteHeader />
      <SpeciesWall speciesList={[...species]} />
      <SiteFooter />
    </main>
  );
}
