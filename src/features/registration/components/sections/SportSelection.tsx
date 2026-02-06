"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import type { Event } from "@/src/types/event";
import type { SportRecord } from "@/src/types/sport";
import type { FormErrors } from "@/src/types/registration";
import { SelectableCard } from "@/src/components/ui/selectTableCard";
import { FormError, SectionTitle } from "@/src/components/ui/formElements";
import { Grid } from "@/src/shared/utils/patterns";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { Skeleton } from "@/src/components/ui/skeleton";

interface SportSelectionProps {
  event?: Event;
  selectedSport?: string;
  onSelect?: (sport: string) => void;
  errors?: Partial<FormErrors>;
}

const normalizeSport = (s: string | SportRecord) =>
  typeof s === "string"
    ? { id: s, name: s, categories: [] }
    : {
        id: s.id ?? s.name,
        name: s.name ?? String(s),
        categories: s.categories ?? s.category ?? [],
      };

export function SportSelection({
  event: propEvent,
  selectedSport,
  onSelect,
  errors,
}: SportSelectionProps) {
  const router = useRouter();
  const { events, loading } = useEvents();

  // Get event from props or session storage
  const eventId = propEvent?.id || sessionStorage.getItem("selectedEventId");
  const event = propEvent || events.find((e) => e.id === eventId);

  const sports = (event?.sports ?? []).map(normalizeSport);

  const handleSelect = async (sportName: string) => {
    // Store selected sport
    sessionStorage.setItem("selectedSport", sportName);

    // Call callback if provided
    if (onSelect) {
      onSelect(sportName);
    }

    // Small delay to ensure state updates propagate
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Navigate to category step
    router.push(`/register?step=${REGISTRATION_STEP_PARAMS.category}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Grid cols={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle subtitle="ជ្រើសប្រកួតដែលអ្នកចង់ចូលរួម">
        ជ្រើសរើសកីឡា
      </SectionTitle>
      <FormError message={errors?.sport} />
      <Grid cols={4}>
        {sports.map((sport) => (
          <SelectableCard
            key={sport.id}
            title={sport.name}
            as="button"
            selected={selectedSport === sport.name}
            onSelect={() => handleSelect(sport.name)}
            className="items-center justify-center p-6 text-center"
          />
        ))}
      </Grid>
    </div>
  );
}
