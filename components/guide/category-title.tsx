"use client";

import { useEffect, useState } from "react";

import ElasticMesh from "@/components/ui/ElasticMesh";

export function CategoryTitle({ title }: { title: string }) {
  const [fontFamily, setFontFamily] = useState("Georgia, serif");

  useEffect(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-libre").trim();
    if (family) setFontFamily(family);
  }, []);

  return (
    <div className="category-mesh">
      <h1 id="category-title" className="sr-only">
        {title}
      </h1>
      <ElasticMesh
        text={title}
        fontFamily={fontFamily}
        fontWeight={700}
        material="balloon"
        color="#1c3a2e"
        inflate={1}
        stiffness={0.5}
        wobble={0.6}
        theme="light"
        intro
      />
    </div>
  );
}
