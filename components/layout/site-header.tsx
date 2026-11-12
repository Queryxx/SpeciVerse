import { SpeciverseMark } from "@/components/brand/speciverse-mark";
import { CategoryMenu } from "@/components/layout/category-menu";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="/" aria-label="SpeciVerse home">
        <SpeciverseMark className="brand-icon" />
        <span className="brand-word">
          Speci<em>Verse</em>
        </span>
      </a>
      <span className="header-edition">
       
        <a className="staff-link" href="/auth/login">
          Staff
        </a>
      </span>
      <CategoryMenu />
    </header>
  );
}
