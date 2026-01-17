import type { Event } from "../../../types/event";
import type { SportRecord } from "../../../types/sport";
import type { FormErrors } from '@/types/registration'
import { SelectableCard } from '@/components/ui/selectTableCard'

interface SportSelectionProps {
  event?: Event;
  selectedSport: string;
  onSelect: (sport: string) => void;
  errors?: Partial<FormErrors>;
}

export function SportSelection({ event, selectedSport, onSelect, errors }: SportSelectionProps) {
  type NormalizedSport = { id: string; name: string; categories: string[] };
  const normalize = (s: string | SportRecord): NormalizedSport =>
    typeof s === "string"
      ? { id: s, name: s, categories: [] }
      : { id: s.id ?? s.name, name: s.name ?? String(s), categories: s.categories ?? s.category ?? [] };

  const raw = event?.sports ?? [];
  const sports = raw.map(normalize);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ជ្រើសរើសកីឡា</h2>
        <p className="text-muted-foreground text-lg">
          ជ្រើសប្រកួតដែលអ្នកចង់ចូលរួម
        </p>
        {errors?.sport && <p className="text-sm text-red-600 mt-1">{errors.sport}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {sports.map((sport) => (
          <SelectableCard
            key={sport.id}
            title={sport.name}
            as="button"
            selected={selectedSport === sport.name}
            onSelect={() => onSelect(sport.name)}
            className="items-center justify-center p-6 text-center"
          />
        ))}
      </div>
    </div>
  );
}