"use client";

import { cn } from "@/src/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useRegistrationSteps } from "./useRegistrationSteps";

export function RegistrationSidebar() {
  const { stepsWithState, stepsLength, navigateToStep } =
    useRegistrationSteps();

  return (
    <aside className="hidden lg:flex lg:flex-col w-80 bg-white/95 border-r border-slate-200 p-6 lg:sticky lg:top-18 lg:h-[calc(100vh-72px)] lg:overflow-y-auto lg:pb-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          ជំហានចុះឈ្មោះ
        </h3>

        {stepsWithState.map((step) => {
          const Icon = step.icon;

          return (
            <button
              key={step.param}
              onClick={() => step.isAccessible && navigateToStep(step.param)}
              disabled={!step.isAccessible}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "text-left",
                step.isActive &&
                  "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600",
                !step.isActive &&
                  step.isCompleted &&
                  "bg-green-50 text-green-700 hover:bg-green-100",
                !step.isActive &&
                  !step.isCompleted &&
                  step.isAccessible &&
                  "text-slate-600 hover:bg-slate-50",
                !step.isAccessible &&
                  "text-slate-300 cursor-not-allowed opacity-50",
              )}
            >
              <div
                className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  step.isActive && "bg-indigo-600 text-white",
                  step.isCompleted &&
                    !step.isActive &&
                    "bg-green-600 text-white",
                  !step.isActive &&
                    !step.isCompleted &&
                    "bg-slate-200 text-slate-600",
                )}
              >
                {step.isCompleted && !step.isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {step.displayLabel}
                </div>
                <div className="text-xs text-slate-500">
                  ជំហាន {step.index + 1} នៃ {stepsLength}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
