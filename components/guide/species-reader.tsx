"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import CardSwap, { type CardSwapHandle } from "@/components/ui/CardSwap";
import { SpeciesPageContent } from "@/components/guide/species-page";
import { species, speciesPages, type Species, type SpeciesPage } from "@/data/species";

const plateItems = species.map((item) => ({
  title: item.name,
  image: item.image,
  alt: item.imageAlt,
}));

type SpeciesReaderProps = {
  selected: Species;
  activePage: SpeciesPage;
  isTurning: boolean;
  onSelectPage: (page: SpeciesPage) => void;
  onSelect: (species: Species) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function SpeciesReader({
  selected,
  activePage,
  isTurning,
  onSelectPage,
  onSelect,
  onPrevious,
  onNext,
}: SpeciesReaderProps) {
  const swapRef = useRef<CardSwapHandle>(null);
  const skipSync = useRef(false);
  const plateNumber = String(species.findIndex((item) => item.id === selected.id) + 1).padStart(3, "0");

  function handleSwap(index: number) {
    const next = species[index];
    if (!next || next.id === selected.id) return;
    skipSync.current = true;
    onSelect(next);
  }

  useEffect(() => {
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    const index = species.findIndex((item) => item.id === selected.id);
    if (index >= 0) swapRef.current?.show(index);
  }, [selected.id]);

  return (
    <section className="reader-section" aria-label="Species reading experience">
      <div className={`book-spread ${isTurning ? "is-turning" : ""}`}>
        <div className="book-page text-page" aria-live="polite">
          <div className="page-topline">
            <span>THE WILD, OBSERVED</span>
            <span>
              01 <span className="topline-dash">—</span> 04
            </span>
          </div>
          <div className="animal-heading">
            <span className="species-category">
              {selected.category.toUpperCase()} <span>·</span> {selected.status.toUpperCase()}
            </span>
            <h3>{selected.name}</h3>
            <span className="scientific-name">{selected.scientific}</span>
          </div>

          <nav className="page-tabs" aria-label="Species information pages">
            {speciesPages.map((page, index) => (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                className={`page-tab ${activePage === page ? "active" : ""}`}
                onClick={() => onSelectPage(page)}
                aria-current={activePage === page ? "page" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {page}
              </Button>
            ))}
          </nav>

          <SpeciesPageContent key={`${selected.id}-${activePage}`} species={selected} page={activePage} />

          <div className="page-footer">
            <Button
              variant="ghost"
              size="icon"
              className="page-arrow"
              onClick={() => {
                if (swapRef.current) swapRef.current.prev();
                else onPrevious();
              }}
              aria-label="Previous species"
              title="Previous species"
            >
              <ArrowLeft size={17} />
            </Button>
            <span>
              TURN THE PAGE <BookOpen size={14} />
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="page-arrow"
              onClick={() => {
                if (swapRef.current) swapRef.current.next();
                else onNext();
              }}
              aria-label="Next species"
              title="Next species"
            >
              <ArrowRight size={17} />
            </Button>
          </div>
        </div>

        <div className="book-page image-page">
          <div className="species-card-swap">
            <CardSwap
              ref={swapRef}
              items={plateItems}
              width={560}
              height={400}
              cardDistance={60}
              verticalDistance={70}
              depth={90}
              skewAmount={6}
              visibleCards={4}
              cardRadius={18}
              delay={4000}
              speed={1}
              bounce={0.35}
              parallax={0.5}
              hoverSpread={0.12}
              dim={0.5}
              autoplay
              pauseOnHover
              draggable
              theme="light"
              onChange={handleSwap}
            />
          </div>
          <div className="image-page-footer">
            <span>
              SpeciVerse <span>BOTANICAL & ZOOLOGICAL RECORD</span>
            </span>
            <span>NO. {plateNumber}</span>
          </div>
        </div>
        {isTurning && <div className="page-turn-overlay" aria-hidden="true" />}
      </div>
      <p className="reader-caption">
        <span>◦</span> HAND-BOUND STORIES FROM THE NATURAL WORLD <span>◦</span>
      </p>
    </section>
  );
}
