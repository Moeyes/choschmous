"use client";

import { useEffect } from "react";

import { useSearchParams } from "next/navigation";
import { Card } from "@/src/components/ui/card";
import { EventSelection } from "@/src/features/registration/components/sections/EventSelection";
import { SportSelection } from "@/src/features/registration/components/sections/SportSelection";
import { SportCategory } from "@/src/features/registration/components/sections/SportCategory";
import { LocationDetails } from "@/src/features/registration/components/sections/LocationDetails";
import { PersonalInfo } from "@/src/features/registration/components/sections/PersonalInfo";
import { RegistrationConfirmation } from "@/src/features/registration/components/RegistrationConfirmation";
import { RegistrationAction } from "@/src/features/registration/components/RegistrationAction";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { useRegistrationForm } from "@/src/features/registration/hooks/useRegistrationForm";

export function RegistrationContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || REGISTRATION_STEP_PARAMS.event;
  const { formData, setField } = useRegistrationForm();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      step === REGISTRATION_STEP_PARAMS.event ||
      step === REGISTRATION_STEP_PARAMS.success
    ) {
      sessionStorage.removeItem("selectedEventId");
      sessionStorage.removeItem("selectedOrganization");
      sessionStorage.removeItem("selectedSport");
      sessionStorage.removeItem("selectedCategory");
      sessionStorage.removeItem("registrationId");
    }
  }, [step]);

  let registrationId: string | undefined = undefined;
  if (
    typeof window !== "undefined" &&
    step === REGISTRATION_STEP_PARAMS.success
  ) {
    registrationId = sessionStorage.getItem("registrationId") || undefined;
  }

  return (
    <Card className="p-6 bg-white shadow-lg">
      {step === REGISTRATION_STEP_PARAMS.event && <EventSelection />}
      {step === REGISTRATION_STEP_PARAMS.sport && (
        <SportSelection onSelect={(sport) => setField({ sport })} />
      )}
      {step === REGISTRATION_STEP_PARAMS.organization && (
        <LocationDetails onSelect={(org) => setField({ organization: org })} />
      )}
      {step === REGISTRATION_STEP_PARAMS.category && (
        <SportCategory onSelect={(category) => setField({ category })} />
      )}
      {step === REGISTRATION_STEP_PARAMS.personal && (
        <PersonalInfo formData={formData} updateFormData={setField} />
      )}
      {step === REGISTRATION_STEP_PARAMS.confirm && (
        <RegistrationConfirmation formData={formData} />
      )}
      {step === REGISTRATION_STEP_PARAMS.success && (
        <RegistrationAction
          formData={formData}
          registrationId={registrationId}
        />
      )}
    </Card>
  );
}
