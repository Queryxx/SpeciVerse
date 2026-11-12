"use client";

import BubbleMenu from "@/components/ui/BubbleMenu";
import { categorySlug, speciesCategories } from "@/data/species";

const HOVER = [
  { bgColor: "#245c45", textColor: "#ffffff" },
  { bgColor: "#3b82f6", textColor: "#ffffff" },
  { bgColor: "#f59e0b", textColor: "#ffffff" },
  { bgColor: "#0f766e", textColor: "#ffffff" },
];

const ROTATION = [-8, 8, 8, -8];

const items = speciesCategories.map((category, index) => ({
  label: category.toLowerCase(),
  href: category === "All species" ? "/" : `/category/${categorySlug(category)}`,
  ariaLabel: category,
  rotation: ROTATION[index] ?? 0,
  hoverStyles: HOVER[index] ?? HOVER[0],
}));

export function CategoryMenu() {
  return (
    <BubbleMenu
      items={items}
      placement="inline"
      menuAriaLabel="Toggle categories"
      menuBg="#ffffff"
      menuContentColor="#1c3a2e"
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
    />
  );
}
