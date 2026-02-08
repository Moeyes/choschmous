"use client";

import { useSearchParams } from "next/navigation";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { toKhmerDigits } from "@/src/lib/khmer";

const STEP_ORDER = [
  REGISTRATION_STEP_PARAMS.event,
  REGISTRATION_STEP_PARAMS.sport,
  REGISTRATION_STEP_PARAMS.category,
  REGISTRATION_STEP_PARAMS.organization,
  REGISTRATION_STEP_PARAMS.personal,
  REGISTRATION_STEP_PARAMS.confirm,
  REGISTRATION_STEP_PARAMS.success,
];

export function RegistrationProgress() {
  const searchParams = useSearchParams();
  const currentStep =
    searchParams.get("step") || REGISTRATION_STEP_PARAMS.event;

  const currentIndex = STEP_ORDER.indexOf(currentStep as any);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">
          ជំហានទី {toKhmerDigits(currentIndex + 1)} នៃ{" "}
          {toKhmerDigits(STEP_ORDER.length)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {STEP_ORDER.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`h-2 rounded-full w-full transition-all duration-300 ${
                index <= currentIndex ? "bg-indigo-600" : "bg-slate-200"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
