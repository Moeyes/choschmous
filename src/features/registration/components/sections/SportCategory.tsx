"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import type { Event } from "@/src/types/event";
import type { SportRecord } from "@/src/types/sport";
import type { FormErrors } from "@/src/types/registration";
import { Button } from "@/src/components/ui/button";
import { FormError, SectionTitle } from "@/src/components/ui/formElements";
import { Grid } from "@/src/shared/utils/patterns";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { Skeleton } from "@/src/components/ui/skeleton";

interface SportCategoryProps {
  event?: Event;
  selectedSport?: string;
  onSelect?: (category: string) => void;
  errors?: Partial<FormErrors>;
}

const normalizeSport = (s: string | SportRecord) =>
  typeof s === "string"
    ? { id: s, name: s, categories: [] }
    : {
        id: s.id ?? s.name,
        name: s.name ?? String(s),
        categories: (s.categories ?? s.category ?? []).flat(),
      };

export function SportCategory({
  event: propEvent,
  selectedSport: propSport,
  onSelect,
  errors,
}: SportCategoryProps) {
  const router = useRouter();
  const { events, loading } = useEvents();

  // Get event and sport from props or session storage
  const eventId = propEvent?.id || sessionStorage.getItem("selectedEventId");
  const event = propEvent || events.find((e) => e.id === eventId);
  const selectedSport = propSport || sessionStorage.getItem("selectedSport");

  const normalized = (event?.sports ?? []).map(normalizeSport);
  const sportObj = normalized.find((s) => s.name === selectedSport);

  const categories = sportObj?.categories?.length
    ? sportObj.categories
    : normalized.flatMap((s) => s.categories).length
      ? normalized.flatMap((s) => s.categories)
      : ["Open"];

  const handleSelect = async (category: string) => {
    // Store selected category
    sessionStorage.setItem("selectedCategory", category);

    // Call callback if provided
    if (onSelect) {
      onSelect(category);
    }

    // Small delay to ensure state updates propagate
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Navigate to organization step
    router.push(`/register?step=${REGISTRATION_STEP_PARAMS.organization}`);
  };

  if (loading) {
    return (
      <div className="space-y-6 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Grid cols={1} className="max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </Grid>
      </div>
    );
  }

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
            onClick={() => handleSelect(cat)}
          >
            {cat}
          </Button>
        ))}
      </Grid>
    </div>
  );
}
