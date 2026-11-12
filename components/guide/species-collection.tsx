"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import InfiniteMenu from "@/components/ui/InfiniteMenu";
import { Input } from "@/components/ui/input";
import { speciesCategories, type Species, type SpeciesCategory } from "@/data/species";

type SpeciesCollectionProps = {
  speciesList: Species[];
  selectedId: string;
  category: SpeciesCategory;
  searchTerm: string;
  onCategoryChange: (category: SpeciesCategory) => void;
  onSearchChange: (value: string) => void;
  onOpen: (species: Species) => void;
};

export function SpeciesCollection({
  speciesList,
  selectedId,
  category,
  searchTerm,
  onCategoryChange,
  onSearchChange,
  onOpen,
}: SpeciesCollectionProps) {
  const menuKey = speciesList.map((item) => item.id).join("|");
  const menuItems = useMemo(
    () =>
      speciesList.map((item) => ({
        image: item.image,
        link: `/?species=${item.id}`,
        title: item.name,
        description: item.scientific,
      })),
    [menuKey],
  );

  return (
    <section className="collection-section" id="collection" aria-labelledby="collection-title">
      <div className="collection-heading">
        <div>
          <span className="chapter-label">THE FIELD GUIDE INDEX</span>
          <h2 id="collection-title">
            Wander <em>a little further</em>
          </h2>
        </div>
        <label className="search-field">
          <Search size={16} />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find a species…"
            aria-label="Search species"
          />
        </label>
      </div>
      <div className="collection-toolbar">
        <div className="category-tabs" aria-label="Filter species by type">
          {speciesCategories.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="sm"
              className={`category-tab ${category === item ? "active" : ""}`}
              onClick={() => onCategoryChange(item)}
              aria-pressed={category === item}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="collection-actions">
          <span className="species-count">
            {speciesList.length} <span>SPECIES IN VIEW</span>
          </span>
          <Link href="/species" className="see-all-button">
            See all
          </Link>
        </div>
      </div>

      {menuItems.length === 0 ? (
        <p className="empty-result">No species found. Try another name or region.</p>
      ) : (
        <div className="infinite-stage">
          <InfiniteMenu
            items={menuItems}
            count={160}
            tileSize={0.63}
            roundness={0.2}
            zoom={1.65}
            pullBack={1}
            stretch={0.6}
            inertia={0.6}
            autoplay={3}
            grayscale
            dim={0.5}
            intro
            showInfo
            theme="dark"
            accentColor="#ffffff"
            backgroundColor="#14261e"
            onItemClick={(item) => {
              const match = speciesList.find((entry) => entry.name === item.title);
              if (match && match.id !== selectedId) onOpen(match);
            }}
          />
        </div>
      )}
    </section>
  );
}
