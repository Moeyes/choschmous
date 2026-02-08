"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import type { Event } from "@/src/types/event";
import type { SportRecord } from "@/src/types/sport";
import type { FormErrors } from "@/src/types/registration";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { Skeleton } from "@/src/components/ui/skeleton";
// import { RegistrationSidebar, SelectionPill, ContentHeader } from "../shared";
import { SelectionPill, ContentHeader, SectionCard } from "../shared";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  useEffect(() => {
    // Load previously selected category
    const storedCategory = sessionStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
  }, []);

  const handleSelect = async (category: string) => {
    setSelectedCategory(category);
    sessionStorage.setItem("selectedCategory", category);

    if (onSelect) {
      onSelect(category);
    }

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    router.push(`/register?step=${REGISTRATION_STEP_PARAMS.organization}`);
  };

  if (loading) {
    return (
      <div className="reg-split-layout">
        <Skeleton className="w-64 rounded-xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-12 w-48" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-40 rounded-full" />
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
            label: "ព្រឹត្តិការណ៍",
            value: event?.name || null,
            color: "indigo",
          },
          { label: "កីឡា", value: selectedSport, color: "purple" },
        ]}
      /> */}

      <div className="reg-content">
        <ContentHeader
          title="ជ្រើសរើសប្រភេទ"
          subtitle="ជ្រើសរើសប្រភេទដែលអ្នកចង់ប្រកួត"
        />
        <SectionCard title="ប្រភេទកីឡា">
          {errors?.sport && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.sport}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat) => (
              <SelectionPill
                key={cat}
                label={cat}
                isSelected={selectedCategory === cat}
                onClick={() => handleSelect(cat)}
                variant="purple"
              />
            ))}
          </div>

          {categories.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              <p>មិនមានប្រភេទសម្រាប់កីឡានេះទេ</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
