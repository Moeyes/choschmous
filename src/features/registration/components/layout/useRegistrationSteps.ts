"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  REGISTRATION_STEP_PARAMS,
  REGISTRATION_STEP_LABELS,
} from "@/src/config/constants";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import {
  Calendar,
  Trophy,
  Grid,
  Building2,
  User,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";

const STEPS = [
  {
    param: REGISTRATION_STEP_PARAMS.event,
    label: REGISTRATION_STEP_LABELS.event,
    icon: Calendar,
  },
  {
    param: REGISTRATION_STEP_PARAMS.sport,
    label: REGISTRATION_STEP_LABELS.sport,
    icon: Trophy,
  },
  {
    param: REGISTRATION_STEP_PARAMS.category,
    label: REGISTRATION_STEP_LABELS.category,
    icon: Grid,
  },
  {
    param: REGISTRATION_STEP_PARAMS.organization,
    label: REGISTRATION_STEP_LABELS.organization,
    icon: Building2,
  },
  {
    param: REGISTRATION_STEP_PARAMS.personal,
    label: REGISTRATION_STEP_LABELS.personal,
    icon: User,
  },
  {
    param: REGISTRATION_STEP_PARAMS.confirm,
    label: REGISTRATION_STEP_LABELS.confirm,
    icon: CheckCircle2,
  },
  {
    param: REGISTRATION_STEP_PARAMS.success,
    label: REGISTRATION_STEP_LABELS.success,
    icon: PartyPopper,
  },
] as const;

export type RegistrationStep = (typeof STEPS)[number];

export type RegistrationStepWithState = RegistrationStep & {
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isAccessible: boolean;
  displayLabel: string;
};

export function useRegistrationSteps() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(null);

  const currentStep =
    searchParams.get("step") || REGISTRATION_STEP_PARAMS.event;

  const currentStepIndex = useMemo(() => {
    const foundIndex = STEPS.findIndex((s) => s.param === currentStep);
    return foundIndex === -1 ? 0 : foundIndex;
  }, [currentStep]);

  // Load selected values from sessionStorage
  useEffect(() => {
    const loadSelections = () => {
      const eventId = sessionStorage.getItem("selectedEventId");
      const sport = sessionStorage.getItem("selectedSport");
      const category = sessionStorage.getItem("selectedCategory");
      const orgStr = sessionStorage.getItem("selectedOrganization");

      setSelectedEventId(eventId);
      setSelectedSport(sport);
      setSelectedCategory(category);

      if (orgStr) {
        try {
          const org = JSON.parse(orgStr);
          setSelectedOrganization(org.name || null);
        } catch {
          setSelectedOrganization(null);
        }
      }
    };

    // Load on mount
    loadSelections();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadSelections();
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for changes in the same tab
    const interval = setInterval(() => {
      loadSelections();
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId),
    [events, selectedEventId],
  );

  const navigateToStep = useCallback(
    (stepParam: string) => {
      router.push(`/register?step=${stepParam}`);
    },
    [router],
  );

  const getDisplayLabel = useCallback(
    (stepParam: string, defaultLabel: string, isCompleted: boolean) => {
      if (stepParam === REGISTRATION_STEP_PARAMS.event && selectedEvent) {
        return selectedEvent.name;
      }
      if (stepParam === REGISTRATION_STEP_PARAMS.sport && selectedSport) {
        return selectedSport;
      }
      if (stepParam === REGISTRATION_STEP_PARAMS.category && selectedCategory) {
        return selectedCategory;
      }
      if (
        stepParam === REGISTRATION_STEP_PARAMS.organization &&
        selectedOrganization
      ) {
        return selectedOrganization;
      }
      if (stepParam === REGISTRATION_STEP_PARAMS.success && isCompleted) {
        return "បានបញ្ជាក់";
      }

      return defaultLabel;
    },
    [selectedCategory, selectedEvent, selectedOrganization, selectedSport],
  );

  const stepsWithState: RegistrationStepWithState[] = useMemo(
    () =>
      STEPS.map((step, index) => {
        const isActive = step.param === currentStep;
        const isCompleted = index < currentStepIndex;
        const isAccessible = index <= currentStepIndex;

        return {
          ...step,
          index,
          isActive,
          isCompleted,
          isAccessible,
          displayLabel: getDisplayLabel(step.param, step.label, isCompleted),
        };
      }),
    [currentStep, currentStepIndex, getDisplayLabel],
  );

  return {
    stepsWithState,
    stepsLength: STEPS.length,
    currentStepIndex,
    currentStep,
    navigateToStep,
  };
}

export { STEPS };
