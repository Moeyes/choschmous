"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import type { Event } from "@/src/types/event";
import type { SportRecord } from "@/src/types/sport";
import type { FormErrors } from "@/src/types/registration";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { Skeleton } from "@/src/components/ui/skeleton";
// import { RegistrationSidebar, SelectionPill, ContentHeader } from "../shared";
import { SelectionPill, ContentHeader, SectionCard } from "../shared";

const FEEDBACK_DELAY_MS = 300;

const normalizeSport = (s: string | SportRecord) =>
  typeof s === "string"
    ? { id: s, name: s, categories: [] }
    : {
        id: s.id ?? s.name,
        name: s.name ?? String(s),
        categories: s.categories ?? s.category ?? [],
      };

const getStoredEventId = (propEvent?: Event) =>
  propEvent?.id || sessionStorage.getItem("selectedEventId");

const resolveEvent = (
  propEvent: Event | undefined,
  events: Event[],
  eventId: string | null,
) => propEvent || events.find((event) => event.id === eventId);

const deriveSports = (event?: Event) =>
  (event?.sports ?? []).map(normalizeSport);

const loadStoredSport = (propSelectedSport?: string) =>
  propSelectedSport || sessionStorage.getItem("selectedSport");

const persistSportSelection = (sportName: string) => {
  sessionStorage.setItem("selectedSport", sportName);
};

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

function useEventData(propEvent: Event | undefined, events: Event[]) {
  const eventId = useMemo(() => getStoredEventId(propEvent), [propEvent]);
  const event = useMemo(
    () => resolveEvent(propEvent, events, eventId),
    [propEvent, events, eventId],
  );
  const sports = useMemo(() => deriveSports(event), [event]);

  return { event, sports };
}

function usePersistedSelectedSport(propSelectedSport?: string) {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  useEffect(() => {
    const initialSport = loadStoredSport(propSelectedSport);
    if (initialSport) {
      setSelectedSport(initialSport);
    }
  }, [propSelectedSport]);

  const persistAndSet = useCallback((sportName: string) => {
    setSelectedSport(sportName);
    persistSportSelection(sportName);
  }, []);

  return { selectedSport, persistAndSet };
}

function useNavigateToCategory() {
  const router = useRouter();

  return useCallback(() => {
    router.push(`/register?step=${REGISTRATION_STEP_PARAMS.category}`);
  }, [router]);
}

function useSportSelectionHandler({
  onSelect,
  persistSelectedSport,
  navigateToCategory,
}: {
  onSelect?: (sport: string) => void;
  persistSelectedSport: (sport: string) => void;
  navigateToCategory: () => void;
}) {
  return useCallback(
    async (sportName: string) => {
      persistSelectedSport(sportName);
      onSelect?.(sportName);
      await wait(FEEDBACK_DELAY_MS);
      navigateToCategory();
    },
    [persistSelectedSport, onSelect, navigateToCategory],
  );
}

interface SportSelectionProps {
  event?: Event;
  selectedSport?: string;
  onSelect?: (sport: string) => void;
  errors?: Partial<FormErrors>;
}

export function SportSelection({
  event: propEvent,
  selectedSport: propSelectedSport,
  onSelect,
  errors,
}: SportSelectionProps) {
  const { events, loading } = useEvents();
  const { event, sports } = useEventData(propEvent, events);
  const { selectedSport, persistAndSet } =
    usePersistedSelectedSport(propSelectedSport);
  const navigateToCategory = useNavigateToCategory();
  const handleSelect = useSportSelectionHandler({
    onSelect,
    persistSelectedSport: persistAndSet,
    navigateToCategory,
  });

  if (loading) {
    return (
      <div className="reg-split-layout">
        <Skeleton className="w-64 rounded-xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-12 w-48" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-split-layout">
      {/* <RegistrationSidebar
        sections={[
          {
            label: "ព្រឹត្តិការណ៍ដែលបានជ្រើសរើស",
            value: event?.name || null,
            color: "indigo",
          },
        ]}
      /> */}

      <div className="reg-content">
        <ContentHeader
          title="ជ្រើសរើសកីឡា"
          subtitle="ជ្រើសរើសកីឡាដែលអ្នកចង់ប្រកួត"
        />
        <SectionCard title="បញ្ជីកីឡា">
          {errors?.sport && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.sport}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sports.map((sport) => (
              <SelectionPill
                key={sport.id}
                label={sport.name}
                isSelected={selectedSport === sport.name}
                onClick={() => handleSelect(sport.name)}
                variant="indigo"
              />
            ))}
          </div>

          {sports.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              <p>មិនមានកីឡាសម្រាប់ព្រឹត្តិការណ៍នេះទេ</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
