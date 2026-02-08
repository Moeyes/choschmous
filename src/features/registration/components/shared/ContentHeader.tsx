interface ContentHeaderProps {
  title: string;
  subtitle: string;
}

export function ContentHeader({ title, subtitle }: ContentHeaderProps) {
  return (
    <div className="reg-content-header">
      <h2 className="reg-content-title">{title}</h2>
      <p className="reg-content-subtitle">{subtitle}</p>
    </div>
  );
}
