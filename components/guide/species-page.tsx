import { Leaf, MapPin } from "lucide-react";

import type { Species, SpeciesPage } from "@/data/species";
import { FactRow } from "@/components/guide/fact-row";

type SpeciesPageContentProps = {
  species: Species;
  page: SpeciesPage;
};

export function SpeciesPageContent({ species, page }: SpeciesPageContentProps) {
  if (page === "At a glance") {
    return (
      <div className="page-content">
        <p className="species-introduction">{species.introduction}</p>
        <span className="text-eyebrow">A FEW QUICK DETAILS</span>
        <div className="fact-list">
          <FactRow label="Habitat" value={species.habitat} />
          <FactRow label="Diet" value={species.diet} />
          <FactRow label="Wild population" value={species.wildPopulation} />
        </div>
        <p className="tiny-footnote">
          <Leaf size={13} /> Part of a living, changing world.
        </p>
      </div>
    );
  }

  if (page === "Range & habitat") {
    return (
      <div className="page-content">
        <p className="species-introduction">
          A portrait of place—where this species finds food, shelter, and room to roam.
        </p>
        <div className="habitat-stamp">
          <MapPin size={17} />
          <div>
            <span>RECORDED RANGE</span>
            <strong>{species.region}</strong>
          </div>
        </div>
        <span className="text-eyebrow">THE LANDSCAPE</span>
        <p className="body-note">
          {species.name} makes a life among the world’s changing habitats. Every sheltered hollow,
          migration path, and quiet stretch of ground helps tell its story.
        </p>
        <div className="fact-list">
          <FactRow label="Home" value={species.habitat} />
          <FactRow label="Feeding" value={species.diet} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <p className="species-introduction">A small detail from the field, worth lingering over.</p>
      <blockquote className="field-quote">“{species.fieldNote}”</blockquote>
      <span className="text-eyebrow">SIGNS TO LOOK FOR</span>
      <ul className="observation-list">
        {species.facts.map((fact) => (
          <li key={fact}>
            <span className="observation-mark">✳</span>
            {fact}
          </li>
        ))}
      </ul>
      <div className="status-note">
        <span className={`status-mark ${species.statusTone}`} /> Status in the wild: {species.status}
      </div>
    </div>
  );
}
