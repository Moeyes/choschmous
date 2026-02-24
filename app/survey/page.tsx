"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ContentHeader } from "@/src/features/registration/components/shared/ContentHeader";
import { SectionCard } from "@/src/features/registration/components/shared/SectionCard";
import { SelectionPill } from "@/src/features/registration/components/shared/SelectionPill";
import orgOptions from "@/src/data/mock/organizations.json";
import events from "@/src/data/mock/events.json";
import { RegistrationTopBar } from "@/src/features/registration/components/layout/RegistrationTopBar";
import { SurveySidebar } from "@/src/features/registration/components/sections/SurveySidebar";

export default function SurveyPage() {
  const sportOptions =
    Array.isArray(events) && events.length > 0 ? events[0].sports : [];

  const [step, setStep] = useState(1);
  const [organization, setOrganization] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => setStep(1);
  const handleNext = () => setStep(2);
  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      // prepare entries for each sport selected
      const payload = selectedSports.map((sportId) => ({
        sport_id: sportId,
        organization_id: organization,
        estimated_participants: 0,
      }));

      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit survey");
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOrg =
    orgOptions.find((o) => o.id === organization)?.khmerName ||
    orgOptions.find((o) => o.id === organization)?.name ||
    "-";

  return (
    <>
      <RegistrationTopBar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <SurveySidebar
          selectedOrg={selectedOrg}
          selectedSports={selectedSports}
          sportOptions={sportOptions}
        />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-370 w-full py-10">
            <Card>
              <CardContent>
                {submitted ? (
                  <div className="py-8">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-6">
                      <div className="text-center">
                        <h2 className="text-lg font-semibold text-green-700">
                          Survey Submitted Successfully
                        </h2>
                        <p className="text-sm text-green-600 mt-1">
                          Thank you for your submission.
                        </p>
                      </div>

                      <div className="border-t border-green-200 pt-6 space-y-4">
                        {/* Organization */}
                        <div>
                          <div className="text-sm text-slate-500 mb-1">
                            Organization
                          </div>
                          <div className="text-sm font-medium text-slate-800 bg-white border rounded-lg px-4 py-2">
                            {selectedOrg || "-"}
                          </div>
                        </div>

                        {/* Sports */}
                        <div>
                          <div className="text-sm text-slate-500 mb-2">
                            Selected Sports
                          </div>

                          {selectedSports.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {sportOptions
                                .filter((s: any) =>
                                  selectedSports.includes(s.id),
                                )
                                .map((s: any) => (
                                  <span
                                    key={s.id}
                                    className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-200"
                                  >
                                    {s.khmerName || s.name}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-400">
                              No sports selected
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 text-red-600 text-sm">{error}</div>
                    )}
                    {/* Step Progress */}
                    <div className="flex items-center justify-between mb-6">
                      {[1, 2].map((n) => (
                        <div
                          key={n}
                          className={`flex-1 h-2 mx-1 rounded-full ${
                            step >= n ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Step 1 */}
                    {step === 1 && (
                      <>
                        <ContentHeader
                          title="ជ្រើសរើសស្ថាប័ន"
                          subtitle="ជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក"
                        />
                        <SectionCard
                          title="ជ្រើសរើសស្ថាប័ន"
                          subtitle="ជ្រើសពីបញ្ជីខាងក្រោម"
                        >
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {orgOptions.map((org) => (
                              <SelectionPill
                                key={org.id}
                                label={org.khmerName || org.name}
                                isSelected={organization === org.id}
                                onClick={() => {
                                  setOrganization(org.id);
                                  handleNext();
                                }}
                                variant="emerald"
                                size="sm"
                              />
                            ))}
                          </div>
                        </SectionCard>
                      </>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <>
                        <ContentHeader
                          title="ជ្រើសរើសកីឡា"
                          subtitle="អាចជ្រើសបានច្រើន"
                        />
                        <SectionCard
                          title="ជ្រើសរើសកីឡា"
                          subtitle="ជ្រើសពីបញ្ជីខាងក្រោម"
                        >
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {sportOptions.map((sport: any) => (
                              <SelectionPill
                                key={sport.id}
                                label={sport.khmerName || sport.name}
                                isSelected={selectedSports.includes(sport.id)}
                                onClick={() =>
                                  setSelectedSports((prev) =>
                                    prev.includes(sport.id)
                                      ? prev.filter((id) => id !== sport.id)
                                      : [...prev, sport.id],
                                  )
                                }
                                variant="emerald"
                                size="sm"
                              />
                            ))}
                          </div>
                        </SectionCard>

                        <div className="flex gap-2 mt-6">
                          <Button variant="secondary" onClick={handleBack}>
                            Back
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={
                              selectedSports.length === 0 || isSubmitting
                            }
                          >
                            {isSubmitting ? "Submitting…" : "Submit"}
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
