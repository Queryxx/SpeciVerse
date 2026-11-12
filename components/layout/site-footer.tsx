import { SpeciverseMark } from "@/components/brand/speciverse-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand-mark" href="/" aria-label="SpeciVerse home">
        <SpeciverseMark className="brand-icon" />
        <span className="brand-word">
          Speci<em>Verse</em>
        </span>
      </a>
      <span>Keep a little wonder close.</span>
      <span>AN OPEN BOOK ON THE NATURAL WORLD</span>
    </footer>
  );
}
