type FactRowProps = {
  label: string;
  value: string;
};

export function FactRow({ label, value }: FactRowProps) {
  return (
    <div className="fact-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
