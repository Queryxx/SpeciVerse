import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { SpeciesIndex } from "@/components/guide/species-index";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { categoryFromSlug, categorySlug, species, speciesCategories } from "@/data/species";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return speciesCategories
    .filter((category) => category !== "All species")
    .map((category) => ({ slug: categorySlug(category) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category} — SpeciVerse`,
    description: `Species recorded under ${category} in the living field guide.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (slug === "all-species") redirect("/");

  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const list = species.filter((item) => item.category === category);

  return (
    <main className="field-guide min-h-screen">
      <SiteHeader />
      <SpeciesIndex title={category} speciesList={list} />
      <SiteFooter />
    </main>
  );
}
