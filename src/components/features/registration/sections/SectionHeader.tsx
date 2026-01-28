interface SectionHeaderProps {
  title: string;
  error?: string;
}

export function SectionHeader({ title, error }: SectionHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-bold">{title}</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
