"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

import { SportSelection } from "./sections/SportSelection";
import { SportCategory } from "./sections/SportCategory";
import { LocationDetails } from "./sections/LocationDetails";
import { PersonalInfo } from "./sections/PersonalInfo";
import { RegistrationConfirmation } from "./RegistrationConfirmation";
import { RegistrationAction } from "./RegistrationAction";

import { EventCard } from "@/src/features/events/components/EventCard";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { validateForm } from "@/src/lib/validation/validators";

import type {
  FormData as RegistrationFormData,
  FormErrors,
} from "@/src/types/registration";
import type { PositionInfo } from "@/src/types/participation";
import { toKhmerDigits } from "@/src/lib/khmer";

const TOTAL_STEPS = 7;

interface RegisteredParticipant {
  id: string;
  name: string;
  sport: string;
  role: string;
}

export default function RegistrationWizard() {
  const params = useParams();
  const eventId = params?.eventId as string | undefined;
  const { events, loading: eventsLoading } = useEvents();

  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof events)[number] | null
  >(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  // Track registered participants for multiple registrations
  const [registeredParticipants, setRegisteredParticipants] = useState<
    RegisteredParticipant[]
  >([]);
  const [lastRegistrationId, setLastRegistrationId] = useState<string | null>(
    null,
  );

  const { formData, setField, errors, setFormErrors, reset } =
    useRegistrationForm();

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const goToStep = (targetStep: number) => {
    setStep(Math.max(1, Math.min(targetStep, TOTAL_STEPS)));
    setValidationMessage(null);
  };

  const attemptAdvance = (
    dataUpdate?: Partial<RegistrationFormData>,
    stepToCheck = step,
  ) => {
    const future = {
      ...formData,
      ...(dataUpdate || {}),
    } as RegistrationFormData;

    const allErrors = validateForm(future);

    const stepFieldMap: Record<number, (keyof FormErrors)[]> = {
      2: ["sport"],
      3: ["category"],
      4: ["organization"],
      5: [
        "fullNameKhmer",
        "fullNameEnglish",
        "dateOfBirth",
        "nationalID",
        "gender",
        "phone",
        "photoUpload",
        "position",
      ],
      6: [],
    };

    const keys = stepFieldMap[stepToCheck] ?? [];
    const filteredErrors: Partial<FormErrors> = {};

    for (const key of keys) {
      const errorValue = allErrors[key];
      if (errorValue) {
        filteredErrors[key] = errorValue;
      }
    }

    setField(dataUpdate || {});

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      setValidationMessage("សូមបំពេញព័ត៌មានដែលខ្វះមុនបន្ត។");
      return;
    }

    setFormErrors({});
    setValidationMessage(null);
    nextStep();
  };

  // Handle successful registration submission
  const handleSubmitSuccess = useCallback(
    (registrationId: string) => {
      const position = formData.position as PositionInfo | undefined;
      const roleName =
        position?.role === "Athlete"
          ? position?.athleteCategory === "Male"
            ? "កីឡាករ"
            : "កីឡាការិនី"
          : position?.leaderRole || "អ្នកចូលរួម";

      const participantName =
        formData.fullNameKhmer || formData.fullNameEnglish || "អ្នកចូលរួម";

      setRegisteredParticipants((prev) => [
        ...prev,
        {
          id: registrationId,
          name: participantName,
          sport: formData.sport || "—",
          role: roleName,
        },
      ]);

      setLastRegistrationId(registrationId);
      nextStep();
    },
    [formData],
  );

  // Reset form for adding another participant
  const handleAddMore = useCallback(() => {
    // Keep event, sport, category, organization but reset personal info
    const preservedData = {
      sport: formData.sport,
      category: formData.category,
      organization: formData.organization,
    };

    reset();
    setField(preservedData);

    // Go back to personal info step (step 5)
    setStep(5);
    setValidationMessage(null);
    setFormErrors({});
    setLastRegistrationId(null);
  }, [
    formData.sport,
    formData.category,
    formData.organization,
    reset,
    setField,
    setFormErrors,
  ]);

  return (
    <div className="min-h-screen bg-white p-6 border rounded-xl shadow-sm">
      <div id="registration-wizard-top" className="max-w-4xl mx-auto">
        {validationMessage && (
          <div className="mb-4 p-3 rounded bg-red-50 border text-red-700 text-sm">
            {validationMessage}
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1 || step === 6}
          >
            ត្រលប់
          </Button>
          <Badge variant="secondary">
            ជំហាន {toKhmerDigits(step)} នៃ {toKhmerDigits(TOTAL_STEPS)}
          </Badge>
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">ព្រឹត្តិការណ៍ទាំងអស់</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventsLoading ? (
                  <div className="h-24 bg-slate-100 animate-pulse rounded" />
                ) : (
                  events.map((e) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      onClick={() => {
                        setSelectedEvent(e);
                        nextStep();
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {step === 2 && selectedEvent && (
              <Card className="p-6">
                <SportSelection
                  event={selectedEvent}
                  selectedSport={formData.sport || ""}
                  onSelect={(sport) => attemptAdvance({ sport }, 2)}
                />
              </Card>
            )}

            {step === 3 && selectedEvent && (
              <Card className="p-6">
                <SportCategory
                  event={selectedEvent}
                  selectedSport={formData.sport}
                  onSelect={(category) => attemptAdvance({ category }, 3)}
                />
              </Card>
            )}

            {step === 4 && (
              <Card className="p-6">
                <LocationDetails
                  selectedOrganization={formData.organization ?? undefined}
                  onSelect={(organization) =>
                    attemptAdvance({ organization }, 4)
                  }
                  errors={errors}
                />
              </Card>
            )}

            {step === 5 && (
              <Card className="p-6">
                <PersonalInfo
                  formData={formData}
                  updateFormData={setField}
                  onNext={() => attemptAdvance(undefined, 5)}
                  errors={errors}
                />
              </Card>
            )}

            {step === 6 && (
              <Card className="p-6">
                <RegistrationConfirmation
                  formData={formData as RegistrationFormData}
                  eventId={selectedEvent?.id ?? eventId ?? ""}
                  eventName={selectedEvent?.name}
                  onEdit={goToStep}
                  onSubmit={handleSubmitSuccess}
                />
              </Card>
            )}

            {step === 7 && (
              <Card className="p-6">
                <RegistrationAction
                  formData={formData as RegistrationFormData}
                  eventId={selectedEvent?.id ?? eventId ?? ""}
                  registrationId={lastRegistrationId ?? undefined}
                  registeredParticipants={registeredParticipants}
                  onAddMore={handleAddMore}
                />
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
