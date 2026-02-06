"use client";

import { useSearchParams } from "next/navigation";
import { Progress } from "@/src/components/ui/card";
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
  const progress = ((currentIndex + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">
          ជំហានទី {toKhmerDigits(currentIndex + 1)} នៃ{" "}
          {toKhmerDigits(STEP_ORDER.length)}
        </span>
        <span className="text-slate-500">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
