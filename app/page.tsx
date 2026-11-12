import type { Metadata } from "next";

import { FieldGuide } from "@/components/guide/field-guide";

export const metadata: Metadata = {
  title: "SpeciVerse — The Living Species Guide",
  description: "Turn the pages of a living field guide to discover the remarkable lives of wild species.",
  openGraph: {
    title: "SpeciVerse — The Living Species Guide",
    description:
      "A beautifully illustrated, page-turning guide to the wild species we share this planet with.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}) {
  const { species: speciesId } = await searchParams;
  return <FieldGuide initialSpeciesId={speciesId} />;
}
