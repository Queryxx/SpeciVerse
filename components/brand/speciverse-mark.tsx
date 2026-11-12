type SpeciverseMarkProps = {
  className?: string;
  animated?: boolean;
};

export function SpeciverseMark({ className, animated = false }: SpeciverseMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      data-animated={animated ? "true" : undefined}
    >
      <circle className="sv-ring" cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="1.6" />
      <ellipse
        className="sv-orbit"
        cx="40"
        cy="40"
        rx="34"
        ry="13"
        transform="rotate(-28 40 40)"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        className="sv-leaf"
        fill="currentColor"
        d="M40 62c0 0-17-13-17.8-26C21.4 24 28 16.5 40 12c12 4.5 18.6 12 17.8 24C57 49 40 62 40 62z"
      />
      <path className="sv-vein" d="M40 17.5v36" stroke="#F6F3EA" strokeWidth="1.2" strokeLinecap="round" />
      <path
        className="sv-vein"
        d="M40 29.5c-5.4 1.5-9 2.8-11.2 3.1M40 39.5c5.6 1.4 9.4 2.6 11.6 2.9"
        stroke="#F6F3EA"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <circle className="sv-star" cx="66.2" cy="18.4" r="2.45" fill="#C6A15A" />
      <circle className="sv-moon" cx="14.2" cy="61.2" r="1.45" fill="#8EAE8A" />
    </svg>
  );
}
