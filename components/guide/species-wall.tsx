"use client";

import Masonry, { type MasonryItem } from "@/components/ui/Masonry";
import type { Species } from "@/data/species";

const FRAMES = [
  { width: 800, height: 560 },
  { width: 600, height: 860 },
  { width: 700, height: 700 },
  { width: 640, height: 900 },
];

export function SpeciesWall({ speciesList }: { speciesList: Species[] }) {
  const items: MasonryItem[] = speciesList.map((item, index) => {
    const frame = FRAMES[index % FRAMES.length] ?? FRAMES[0];
    return {
      id: item.id,
      img: item.image,
      width: frame.width,
      height: frame.height,
      title: item.name,
      description: item.scientific,
      alt: item.imageAlt,
      url: `/?species=${item.id}`,
    };
  });

  return (
    <section className="species-wall" aria-labelledby="species-wall-title">
      <span className="chapter-label">THE FIELD GUIDE INDEX</span>
      <h1 id="species-wall-title">All species</h1>
      <p>Every record in the guide, laid out to wander through.</p>
      {items.length === 0 ? (
        <p className="empty-result">No species have been recorded yet.</p>
      ) : (
        <Masonry
          items={items}
          columnWidth={260}
          gap={14}
          radius={14}
          animateFrom="bottom"
          hoverEffect="zoom"
          captions="hover"
          lightbox
          draggable
          columns="auto"
          stagger={0.05}
          duration={0.6}
          bounce={0.15}
          blurToFocus
          focusOnHover={false}
          parallax={0}
          revealOnScroll
        />
      )}
    </section>
  );
}
