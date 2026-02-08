"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { SelectField } from "../SelectField";
import { PhotoUpload } from "../PhotoUpload";
import { NationalityDocumentUpload } from "../NationalityDocumentUpload";
import { ContentHeader, SectionCard } from "../shared";
import {
  LEADER_ROLES,
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  REGISTRATION_STEP_PARAMS,
} from "@/src/config/constants";
import type { FormData, FormErrors } from "@/src/types/registration";
import type {
  ParticipationGender,
  ParticipationNationality,
  PositionInfo,
  OrganizationInfo,
} from "@/src/types/participation";

interface PersonalInfoProps {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  onNext?: () => void;
  errors?: Partial<FormErrors>;
  hideContinue?: boolean;
}

export function PersonalInfo({
  formData,
  updateFormData,
  onNext,
  errors,
  hideContinue = false,
}: PersonalInfoProps) {
  const router = useRouter();
  const hasName = !!(formData.fullNameKhmer || formData.fullNameEnglish);
  const continueDisabled = !hasName;

  const position = formData.position as PositionInfo | null | undefined;

  // Load context from session storage
  const selectedEvent =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedEventId")
      : null;
  const selectedSport =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedSport")
      : null;
  const selectedCategory =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedCategory")
      : null;
  const storedOrg =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedOrganization")
      : null;

  let selectedOrganization: OrganizationInfo | null = null;
  if (storedOrg) {
    try {
      selectedOrganization = JSON.parse(storedOrg);
    } catch {
      selectedOrganization = null;
    }
  }

  const handleNext = async () => {
    // Call callback if provided
    if (onNext) {
      onNext();
    }

    // Small delay to ensure state updates propagate
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Navigate to confirmation step
    router.push(`/register?step=${REGISTRATION_STEP_PARAMS.confirm}`);
  };

  return (
    <div className="reg-split-layout">
      {/* <RegistrationSidebar
        sections={[
          { label: "ព្រឹត្តិការណ៍", value: selectedEvent, color: "indigo" },
          { label: "កីឡា", value: selectedSport, color: "purple" },
          { label: "ប្រភេទ", value: selectedCategory, color: "pink" },
          {
            label: "ស្ថាប័ន",
            value: selectedOrganization?.name || null,
            color: "emerald",
          },
        ]}
        gradientTo="pink"
      /> */}

      <div className="reg-content">
        <ContentHeader
          title="ព័ត៌មានផ្ទាល់ខ្លួន"
          subtitle="បំពេញព័ត៌មានផ្ទាល់ខ្លួនដើម្បីបញ្ចប់ការចុះឈ្មោះ"
        />

        <div className="space-y-6">
          <SectionCard
            title="ព័ត៌មានសម្គាល់"
            subtitle="បំពេញឈ្មោះពេញទាំងខ្មែរ និង អង់គ្លេស"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="form-label">ឈ្មោះពេញ (ខ្មែរ)</label>
                <Input
                  placeholder="ឈ្មោះពេញ"
                  value={formData.fullNameKhmer ?? ""}
                  onChange={(e) =>
                    updateFormData({ fullNameKhmer: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="form-label">ឈ្មោះពេញ (អង់គ្លេស)</label>
                <Input
                  placeholder="ឈ្មោះពេញជាអក្សរឡាតាំង"
                  value={formData.fullNameEnglish ?? ""}
                  onChange={(e) =>
                    updateFormData({ fullNameEnglish: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="ព័ត៌មានអត្តសញ្ញាណ"
            subtitle="ជ្រើសភេទ និង ប្រភេទឯកសារជាតិសញ្ជាតិ"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="form-label">ភេទ</label>
                <SelectField
                  value={formData.gender ?? undefined}
                  onChange={(val: string) => {
                    const newGender = val as ParticipationGender;
                    // Update gender and athleteCategory if user is an athlete
                    if (position?.role === "Athlete") {
                      updateFormData({
                        gender: newGender,
                        position: {
                          ...position,
                          athleteCategory: newGender,
                        },
                      });
                    } else {
                      updateFormData({ gender: newGender });
                    }
                  }}
                  placeholder="ភេទ"
                  options={[...GENDER_OPTIONS]}
                />
              </div>

              <div className="space-y-2">
                <label className="form-label">ឯកសារជាតិសញ្ជាតិ</label>
                <SelectField
                  value={formData.nationality ?? undefined}
                  onChange={(val: string) =>
                    updateFormData({
                      nationality: val as ParticipationNationality,
                    })
                  }
                  placeholder="ប្រភេទឯកសារជាតិសញ្ជាតិ"
                  options={[...NATIONALITY_OPTIONS]}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="កំណើត និង ទំនាក់ទំនង"
            subtitle="បំពេញថ្ងៃកំណើត លេខអត្តសញ្ញាណ និង ទូរស័ព្ទ"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-1">
                <label className="form-label">ថ្ងៃខែឆ្នាំកំណើត</label>
                <Input
                  type="date"
                  placeholder="ថ្ងៃខែឆ្នាំកំណើត"
                  value={formData.dateOfBirth ?? ""}
                  onChange={(e) =>
                    updateFormData({ dateOfBirth: e.target.value })
                  }
                  className="h-11"
                />
                {errors?.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-1">
                <label className="form-label">លេខអត្តសញ្ញាណជាតិ</label>
                <Input
                  placeholder="លេខអត្តសញ្ញាណជាតិ"
                  value={formData.nationalID ?? ""}
                  onChange={(e) =>
                    updateFormData({ nationalID: e.target.value })
                  }
                  className="h-11"
                />
                {errors?.nationalID && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nationalID}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-1">
                <label className="form-label">លេខទូរស័ព្ទ</label>
                <Input
                  placeholder="ទូរស័ព្ទ"
                  value={formData.phone ?? ""}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  className="h-11"
                />
                {errors?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="តួនាទី និង មុខតំណែង"
            subtitle="ជ្រើសតួនាទី ឬ ការចូលរួមជាកីឡាករ"
          >
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <SelectField
                  value={
                    position?.role === "Leader"
                      ? position.leaderRole
                      : undefined
                  }
                  onChange={(val: string) =>
                    updateFormData({
                      position: {
                        role: "Leader",
                        leaderRole: val,
                        athleteCategory: undefined,
                      },
                    })
                  }
                  placeholder="ជ្រើសតួនាទី (សម្រាប់អ្នកដឹកនាំ)"
                  options={[...LEADER_ROLES]}
                  disabled={position?.role === "Athlete"}
                />
              </div>

              <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Checkbox
                  checked={position?.role === "Athlete"}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      updateFormData({
                        position: {
                          role: "Athlete",
                          athleteCategory: formData.gender,
                          leaderRole: undefined,
                        },
                      });
                    } else {
                      updateFormData({
                        position: undefined,
                      });
                    }
                  }}
                />
                <div className="leading-tight">
                  <p className="text-sm font-medium text-slate-800">
                    ជាកីឡាករ ឬ កីឡាការិនី
                  </p>
                  <p className="text-xs text-slate-500">
                    ត្រូវគ្នានឹងភេទដែលបានជ្រើស
                  </p>
                </div>
              </div>
            </div>

            {errors?.position && (
              <p className="mt-2 text-sm text-red-600">{errors.position}</p>
            )}
          </SectionCard>

          <SectionCard
            title="ឯកសាររូបភាព"
            subtitle="បញ្ចូលរូបថត និង ឯកសារជាតិសញ្ជាតិ"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="form-label">រូបថត</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PhotoUpload
                    file={formData.photoUpload ?? null}
                    onChange={(f) => updateFormData({ photoUpload: f ?? null })}
                  />
                  {formData.photoUrl && (
                    <div className="text-sm text-slate-500">
                      រូបថតបានផ្ទុកឡើង
                    </div>
                  )}
                </div>
                {errors?.photoUpload && (
                  <p className="text-sm text-red-600">{errors.photoUpload}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="form-label">ឯកសារជាតិសញ្ជាតិ</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <NationalityDocumentUpload
                    file={formData.nationalityDocumentUpload ?? null}
                    onChange={(file) =>
                      updateFormData({
                        nationalityDocumentUpload: file ?? null,
                      })
                    }
                  />
                  {formData.nationalityDocumentUrl && (
                    <div className="text-sm text-slate-500">
                      ឯកសារបានផ្ទុកឡើង
                    </div>
                  )}
                </div>
                {errors?.nationalityDocumentUpload && (
                  <p className="text-sm text-red-600">
                    {errors.nationalityDocumentUpload}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {!hideContinue && (
            <SectionCard
              title="បន្តទៅជំហានបន្ទាប់"
              subtitle="ពិនិត្យព័ត៌មានម្តងទៀត មុនបញ្ជាក់"
              className="sticky bottom-4 z-10 backdrop-blur"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  ពិនិត្យព័ត៌មានឲ្យបានត្រឹមត្រូវ មុនបន្តទៅការពិនិត្យ
                </p>
                <Button
                  className="h-11 w-full rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 sm:w-auto sm:px-6"
                  onClick={handleNext}
                  disabled={continueDisabled}
                >
                  បន្តទៅការពិនិត្យ
                </Button>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
