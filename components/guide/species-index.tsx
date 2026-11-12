import { CategoryTitle } from "@/components/guide/category-title";
import { CategoryWall } from "@/components/guide/category-wall";
import type { Species } from "@/data/species";

type SpeciesIndexProps = {
  title: string;
  speciesList: Species[];
};

export function SpeciesIndex({ title, speciesList }: SpeciesIndexProps) {
  return (
    <section className="category-page" aria-labelledby="category-title">
      <span className="chapter-label">FIELD GUIDE INDEX</span>
      <CategoryTitle title={title} />
      <p>{speciesList.length} recorded in this part of the guide.</p>
      {speciesList.length === 0 ? (
        <p className="empty-result">No species have been recorded in this category yet.</p>
      ) : (
        <CategoryWall speciesList={speciesList} />
      )}
    </section>
  );
}
