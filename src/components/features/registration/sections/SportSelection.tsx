import type { Event } from "@/src/types/event";
import type { SportRecord } from "@/src/types/sport";
import type { FormErrors } from '@/src/types/registration'
import { SelectableCard } from '@/src/components/ui/selectTableCard'
import { FormError, SectionTitle } from '@/src/components/ui/formElements'

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
      <SectionTitle subtitle="ជ្រើសប្រកួតដែលអ្នកចង់ចូលរួម">
        ជ្រើសរើសកីឡា
      </SectionTitle>
      <FormError message={errors?.sport} />
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