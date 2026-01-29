import type { Event } from "@/src/types/event"
import type { SportRecord } from "@/src/types/sport"
import { Button } from "@/src/components/ui/button"
import { FormError, SectionTitle } from "@/src/components/ui/formElements"
import { Grid } from '@/src/shared/utils/patterns'
import type { FormErrors } from '@/src/types/registration'

interface SportCategoryProps {
  event?: Event
  selectedSport?: string
  onSelect: (category: string) => void
  errors?: Partial<FormErrors>
}

const normalizeSport = (s: string | SportRecord) => 
  typeof s === "string"
    ? { id: s, name: s, categories: [] }
    : { 
        id: s.id ?? s.name, 
        name: s.name ?? String(s), 
        categories: (s.categories ?? s.category ?? []).flat()
      }

export function SportCategory({ event, selectedSport, onSelect, errors }: SportCategoryProps) {
  const normalized = (event?.sports ?? []).map(normalizeSport)
  const sportObj = normalized.find((s) => s.name === selectedSport)

  const categories = sportObj?.categories?.length
    ? sportObj.categories
    : normalized.flatMap((s) => s.categories).length
    ? normalized.flatMap((s) => s.categories)
    : ["Open"]

  return (
    <div className="space-y-6 text-center">
      <SectionTitle>ជ្រើសប្រភេទ</SectionTitle>
      <FormError message={errors?.sport} />
      <Grid cols={1} className="max-w-md mx-auto">
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
      </Grid>
    </div>
  )
} 