"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  Calendar,
  Trophy,
  Grid,
  Building2,
  User,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import {
  REGISTRATION_STEP_PARAMS,
  REGISTRATION_STEP_LABELS,
} from "@/src/config/constants";

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

export function RegistrationSidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStep =
    searchParams.get("step") || REGISTRATION_STEP_PARAMS.event;

  const currentStepIndex = STEPS.findIndex((s) => s.param === currentStep);

  const navigateToStep = (stepParam: string) => {
    router.push(`/register?step=${stepParam}`);
  };

  return (
    <aside className="hidden lg:block w-80 bg-white border-r border-slate-200 p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          ជំហានចុះឈ្មោះ
        </h3>

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.param === currentStep;
          const isCompleted = index < currentStepIndex;
          const isAccessible = index <= currentStepIndex;

          return (
            <button
              key={step.param}
              onClick={() => isAccessible && navigateToStep(step.param)}
              disabled={!isAccessible}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "text-left",
                isActive &&
                  "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600",
                !isActive &&
                  isCompleted &&
                  "bg-green-50 text-green-700 hover:bg-green-100",
                !isActive &&
                  !isCompleted &&
                  isAccessible &&
                  "text-slate-600 hover:bg-slate-50",
                !isAccessible && "text-slate-300 cursor-not-allowed opacity-50",
              )}
            >
              <div
                className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  isActive && "bg-indigo-600 text-white",
                  isCompleted && !isActive && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-slate-200 text-slate-600",
                )}
              >
                {isCompleted && !isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{step.label}</div>
                <div className="text-xs text-slate-500">
                  ជំហាន {index + 1} នៃ {STEPS.length}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
