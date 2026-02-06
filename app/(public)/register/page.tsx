import { Suspense } from "react";
import { RegistrationContent } from "./RegistrationContent";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="animate-pulse bg-slate-200 h-96 rounded-lg" />}
    >
      <RegistrationContent />
    </Suspense>
  );
}
