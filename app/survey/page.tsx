"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ContentHeader } from "@/src/features/registration/components/shared/ContentHeader";
import { SectionCard } from "@/src/features/registration/components/shared/SectionCard";
import { SelectionPill } from "@/src/features/registration/components/shared/SelectionPill";
import orgOptions from "@/src/data/mock/organizations.json";
import events from "@/src/data/mock/events.json";
import surveys from "@/src/data/mock/surveys.json";

export default function SurveyPage() {
  // Flatten all sports from the first event for survey options
  const sportOptions =
    Array.isArray(events) && events.length > 0 ? events[0].sports : [];

  const [step, setStep] = useState(1);
  const [organization, setOrganization] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [participants, setParticipants] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handler functions
  const handleBack = () => setStep((s) => Math.max(1, s - 1));
  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar/Navbar */}
      <aside className="w-80 bg-white shadow-md rounded-r-2xl p-6 flex flex-col gap-6 mt-8 ml-4">
        <div>
          <div className="font-bold text-lg mb-2">សង្ខេបការជ្រើសរើស</div>
          <div className="mb-2">
            <span className="font-semibold">Organization:</span>{" "}
            {orgOptions.find((o) => o.id === organization)?.khmerName ||
              orgOptions.find((o) => o.id === organization)?.name ||
              "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Sports:</span>
            <ul className="list-disc list-inside ml-4">
              {sportOptions
                .filter((s: any) => selectedSports.includes(s.id))
                .map((s: any) => (
                  <li key={s.id}>{s.khmerName || s.name}</li>
                ))}
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Estimated Participants:</span>{" "}
            {participants || "-"}
          </div>
        </div>
        {/* No Next button in navbar */}
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-xl w-full py-10">
          <Card>
            <CardHeader>
              <CardTitle>Sport Interest Survey</CardTitle>
              <CardDescription>
                Submit your organization’s sport interest before official
                registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-green-600 font-semibold py-8 text-center">
                  Survey submitted! (Mock)
                </div>
              ) : (
                <>
                  {/* Step Progress */}
                  <div className="flex items-center justify-between mb-6">
                    {[1, 2].map((n) => (
                      <div
                        key={n}
                        className={`flex-1 h-2 mx-1 rounded-full ${
                          step >= n ? "bg-primary" : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                  )}
                  {step === 1 && (
                    <>
                      <ContentHeader
                        title="ជ្រើសរើសស្ថាប័ន"
                        subtitle="ជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក"
                      />
                      <SectionCard
                        title="ជ្រើសរើសស្ថាប័ន"
                        subtitle="ជ្រើសក្រសួង ឬ ខេត្តពីបញ្ជីខាងក្រោម"
                      >
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                          {orgOptions.map((org) => (
                            <SelectionPill
                              key={org.id}
                              label={org.khmerName || org.name}
                              isSelected={organization === org.id}
                              onClick={() => {
                                setOrganization(org.id);
                                setStep(2);
                              }}
                              variant="emerald"
                              size="sm"
                            />
                            // No actual write to survey.json
                          ))}
                        </div>
                      </SectionCard>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <ContentHeader
                        title="ជ្រើសរើសកីឡា"
                        subtitle="ជ្រើសរើសកីឡាដែលអង្គភាពអ្នកចាប់អារម្មណ៍ (អាចជ្រើសបានច្រើន)"
                      />
                      <SectionCard
                        title="ជ្រើសរើសកីឡា"
                        subtitle="ជ្រើសកីឡាពីបញ្ជីខាងក្រោម"
                      >
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                          {sportOptions.map((sport: any) => (
                            <SelectionPill
                              key={sport.id}
                              label={sport.khmerName || sport.name}
                              isSelected={selectedSports.includes(sport.id)}
                              onClick={() => {
                                setSelectedSports((prev) =>
                                  prev.includes(sport.id)
                                    ? prev.filter((id) => id !== sport.id)
                                    : [...prev, sport.id],
                                );
                              }}
                              variant="emerald"
                              size="sm"
                            />
                          ))}
                        </div>
                      </SectionCard>
                      <div className="mt-6">
                        <label className="block font-semibold mb-2">
                          Estimated Participants:
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={participants}
                          onChange={(e) => setParticipants(e.target.value)}
                          className="border rounded px-3 py-2 w-full"
                          placeholder="Enter estimated participants"
                        />
                        <Button
                          className="mt-4 w-full"
                          onClick={handleNext}
                          disabled={
                            selectedSports.length === 0 || !participants
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}
                  <div className="flex gap-2 mt-8">
                    {step > 1 && step < 3 && (
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                    )}
                  </div>
                  {step === 3 && (
                    <>
                      <ContentHeader
                        title="សង្ខេប"
                        subtitle="ពិនិត្យមើលព័ត៌មានមុនពេលបញ្ជូន"
                      />
                      <SectionCard
                        title="សង្ខេប"
                        subtitle="ព័ត៌មានដែលបានជ្រើសរើស"
                      >
                        <div className="space-y-4">
                          <div>
                            <b>Organization:</b>{" "}
                            {orgOptions.find((o) => o.id === organization)
                              ?.khmerName ||
                              orgOptions.find((o) => o.id === organization)
                                ?.name}
                          </div>
                          <div>
                            <b>Sports:</b>{" "}
                            {sportOptions
                              .filter((s: any) => selectedSports.includes(s.id))
                              .map((s: any) => s.khmerName || s.name)
                              .join(", ")}
                          </div>
                          <div>
                            <b>Estimated Participants:</b> {participants}
                          </div>
                        </div>
                        <Button className="mt-6 w-full" onClick={handleSubmit}>
                          Submit
                        </Button>
                      </SectionCard>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
