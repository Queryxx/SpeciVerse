"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FlipCard from "@/components/ui/FlipCard";
import Masonry, { type MasonryItem } from "@/components/ui/Masonry";
import type { Species } from "@/data/species";

const FRAMES = [
  { width: 800, height: 560 },
  { width: 600, height: 860 },
  { width: 700, height: 700 },
  { width: 640, height: 900 },
];

export function CategoryWall({ speciesList }: { speciesList: Species[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = speciesList.find((item) => item.id === selectedId) ?? null;
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
    };
  });

  return (
    <>
      <div className="category-wall">
        <Masonry
          items={items}
          columnWidth={260}
          gap={14}
          radius={14}
          animateFrom="bottom"
          hoverEffect="zoom"
          captions="hover"
          draggable
          columns="auto"
          stagger={0.05}
          duration={0.6}
          bounce={0.15}
          blurToFocus
          focusOnHover={false}
          parallax={0}
          revealOnScroll
          onItemClick={(item, _index, event) => {
            event.preventDefault();
            setSelectedId(String(item.id));
          }}
        />
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="w-fit max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none sm:rounded-none">
          {selected ? (
            <>
              <DialogTitle className="sr-only">{selected.name}</DialogTitle>
              <FlipCard
                ariaLabel={`Flip ${selected.name}`}
                width={340}
                height={460}
                radius={22}
                background="#f7f4ec"
                color="#1c3a2e"
                shadowColor="#1c3a2e"
                shadowOpacity={0.28}
                front={
                  <span className="relative block h-full w-full">
                    <img className="h-full w-full object-cover" src={selected.image} alt={selected.imageAlt} />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-16 pb-5 text-white">
                      <span className="block font-serif text-3xl leading-none">{selected.name}</span>
                      <span className="mt-2 block text-sm italic opacity-80">{selected.scientific}</span>
                    </span>
                  </span>
                }
                back={
                  <span className="flex h-full flex-col gap-3 overflow-auto px-5 py-6 text-left">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#4e7a5c] uppercase">
                      {selected.category} · {selected.status}
                    </span>
                    <span className="font-serif text-3xl leading-none">{selected.name}</span>
                    <span className="text-sm italic text-[#4e7a5c]">{selected.scientific}</span>
                    <span className="text-sm leading-6">{selected.introduction}</span>
                    <span className="text-sm leading-6">
                      <strong className="font-medium">Habitat. </strong>
                      {selected.habitat}
                    </span>
                    <span className="text-sm leading-6">
                      <strong className="font-medium">Diet. </strong>
                      {selected.diet}
                    </span>
                    <span className="text-sm leading-6">
                      <strong className="font-medium">Range. </strong>
                      {selected.region}
                    </span>
                    <span className="text-sm leading-6">
                      <strong className="font-medium">In the wild. </strong>
                      {selected.wildPopulation}
                    </span>
                  </span>
                }
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
