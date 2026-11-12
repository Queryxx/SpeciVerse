"use client";

import { useEffect, useState } from "react";

import { SpeciesCollection } from "@/components/guide/species-collection";
import { SpeciesReader } from "@/components/guide/species-reader";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  species,
  type Species,
  type SpeciesCategory,
  type SpeciesPage,
} from "@/data/species";

export function FieldGuide({ initialSpeciesId }: { initialSpeciesId?: string }) {
  const initial = species.find((item) => item.id === initialSpeciesId) ?? species[0];
  const [selected, setSelected] = useState<Species>(initial);
  const [activePage, setActivePage] = useState<SpeciesPage>("At a glance");
  const [category, setCategory] = useState<SpeciesCategory>("All species");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTurning, setIsTurning] = useState(false);

  function turnTo(next: Species, page: SpeciesPage = "At a glance") {
    if (next.id === selected.id && page === activePage) return;
    setIsTurning(true);
    setSelected(next);
    setActivePage(page);
    window.setTimeout(() => setIsTurning(false), 650);
  }

  const visibleSpecies = species.filter((item) => {
    const matchesCategory = category === "All species" || item.category === category;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      `${item.name} ${item.scientific} ${item.region} ${item.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  function showPrevious() {
    const index = species.findIndex((item) => item.id === selected.id);
    const previous = species[(index - 1 + species.length) % species.length] ?? species[0];
    turnTo(previous, activePage);
  }

  function showNext() {
    const index = species.findIndex((item) => item.id === selected.id);
    const next = species[(index + 1) % species.length] ?? species[0];
    turnTo(next, activePage);
  }

  useEffect(() => {
    if (!initialSpeciesId) return;
    document.querySelector(".reader-section")?.scrollIntoView({ block: "start" });
  }, [initialSpeciesId]);

  function openSpecies(item: Species) {
    turnTo(item);
  }

  return (
    <main className="field-guide min-h-screen">
      <SiteHeader />
      <SpeciesReader
        selected={selected}
        activePage={activePage}
        isTurning={isTurning}
        onSelectPage={(page) => turnTo(selected, page)}
        onSelect={(next) => {
          if (next.id !== selected.id) setSelected(next);
        }}
        onPrevious={showPrevious}
        onNext={showNext}
      />
      <SpeciesCollection
        speciesList={visibleSpecies}
        selectedId={selected.id}
        category={category}
        searchTerm={searchTerm}
        onCategoryChange={setCategory}
        onSearchChange={setSearchTerm}
        onOpen={openSpecies}
      />
      <SiteFooter />
    </main>
  );
}
