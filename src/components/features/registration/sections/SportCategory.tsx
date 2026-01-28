import type { Event } from "@/src/types/event";
import type { SportRecord } from "@/src/types/sport";
import { Button } from "@/src/components/ui/button";
import { FormError, SectionTitle } from "@/src/components/ui/formElements";
import type { FormErrors } from '@/src/types/registration'

interface NormalizedSport {
  id: string;
  name: string;
  categories: string[];
}

interface SportCategoryProps {
  event?: Event;
  selectedSport?: string;
  onSelect: (category: string) => void;
  errors?: Partial<FormErrors>;
}

export function SportCategory({ event, selectedSport, onSelect, errors }: SportCategoryProps) {
  const normalized: NormalizedSport[] =
    (event?.sports ?? []).map((s: string | SportRecord) => {
      if (typeof s === "string") {
        return { id: s, name: s, categories: [] };
      }
      // s.categories and s.category are both string[] | undefined
      const rawCategories = s.categories ?? s.category ?? [];
      // Flatten in case we got nested arrays somehow
      const categories = rawCategories.flat();
      return { 
        id: s.id ?? s.name, 
        name: s.name ?? String(s), 
        categories
      };
    });

  const sportObj = normalized.find((s) => s.name === selectedSport);

  const categories: string[] =
    sportObj?.categories?.length
      ? sportObj.categories
      : normalized.flatMap((s) => s.categories ?? []).length
      ? normalized.flatMap((s) => s.categories ?? [])
      : ["Open"];

  return (
    <div className="space-y-6 text-center">
      <SectionTitle>ជ្រើសប្រភេទ</SectionTitle>
      <FormError message={errors?.sport} />
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            className="h-16 text-lg"
            onClick={() => onSelect(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
} 