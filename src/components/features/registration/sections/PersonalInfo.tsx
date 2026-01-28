import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SelectField } from "@/src/components/features/registration/SelectField";
import { PhotoUpload } from "@/src/components/features/registration/PhotoUpload";
import { FormError, SectionTitle } from "@/src/components/ui/formElements";
import type { FormData, FormErrors } from "@/src/types/registration";
import type { ParticipationGender, ParticipationNationality, PositionInfo } from "@/src/types/participation";

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
  const hasName = !!(
    formData.firstName ||
    formData.lastName ||
    formData.firstNameKh ||
    formData.lastNameKh
  );
  const continueDisabled = !hasName;

  const position = formData.position as PositionInfo | null | undefined;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <SectionTitle>ព័ត៌មានផ្ទាល់ខ្លួន</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="គោត្តនាម"
          value={formData.firstNameKh ?? ""}
          onChange={(e) => updateFormData({ firstNameKh: e.target.value })}
        />
        <Input
          placeholder="នាម"
          value={formData.lastNameKh ?? ""}
          onChange={(e) => updateFormData({ lastNameKh: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="គោត្តនាម​​​ (អក្សរឡាតាំង)"
            value={formData.firstName ?? ""}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
          />
          <FormError message={errors?.firstName} />
        </div>
        <div>
          <Input
            placeholder="នាម​ (អក្សរឡាតាំង)"
            value={formData.lastName ?? ""}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
          />
          <FormError message={errors?.lastName} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          value={formData.gender ?? undefined}
          onChange={(val: string) => updateFormData({ gender: val as ParticipationGender })}
          placeholder="ភេទ"
          options={[
            { value: "Male", label: "ប្រុស" },
            { value: "Female", label: "ស្រី" },
          ]}
        />

        <SelectField
          value={formData.nationality ?? undefined}
          onChange={(val: string) =>
            updateFormData({ nationality: val as ParticipationNationality })
          }
          placeholder="ប្រភេទឯកសារជាតិសញ្ជាតិ"
          options={[
            { value: "IDCard", label: "អត្តសញ្ញាណប័ណ្ណ" },
            { value: "BirthCertificate", label: "វិញ្ញាបនបត្រកំណើត" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            type="date"
            placeholder="ថ្ងៃខែឆ្នាំកំណើត"
            value={formData.dateOfBirth ?? ""}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
          />
          <FormError message={errors?.dateOfBirth} />
        </div>
        <div>
          <Input
            placeholder="លេខអត្តសញ្ញាណជាតិ"
            value={formData.nationalID ?? ""}
            onChange={(e) => updateFormData({ nationalID: e.target.value })}
          />
          <FormError message={errors?.nationalID} />
        </div>
      </div>

      <div>
        <Input
          placeholder="ទូរស័ព្ទ"
          value={formData.phone ?? ""}
          onChange={(e) => updateFormData({ phone: e.target.value })}
        />
        <FormError message={errors?.phone} />
      </div>
      <div className="flex-row">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <SelectField
              value={position?.role ?? undefined}
              onChange={(val: string) =>
                updateFormData({
                  position: { ...position, role: val } as PositionInfo,
                })
              }
              placeholder="តួនាទី"
              options={[
                { value: "Athlete", label: "កីឡាករ/កីឡាការិនី" },
                { value: "Leader", label: "អ្នកដឹកនាំ" },
              ]}
            />
          </div>

          <div>
            {position?.role === "Athlete" && (
              <SelectField
                value={position?.athleteCategory ?? undefined}
                onChange={(val: string) =>
                  updateFormData({
                    position: {
                      ...position,
                      athleteCategory: val as ParticipationGender,
                    },
                  })
                }
                placeholder="ប្រភេទកីឡាករ"
                options={[
                  { value: "Male", label: "កីឡាករ" },
                  { value: "Female", label: "កីឡាការិនី" },
                ]}
              />
            )}

            {position?.role === "Leader" && (
              <SelectField
                value={position?.leaderRole ?? undefined}
                onChange={(val: string) =>
                  updateFormData({
                    position: {
                      ...position,
                      leaderRole: val,
                    },
                  })
                }
                placeholder="ជ្រើសតួនាទី"
                options={[
                  { value: "coach", label: "ថ្នាក់ដឹកនាំ" },
                  { value: "manager", label: "គណកម្មការបច្ចេកទេស" },
                  { value: "delegate", label: "ប្រតិភូ" },
                  { value: "team_lead", label: "អ្នកដឹកនាំក្រុម" },
                  { value: "coach_trainer", label: "គ្រូបង្វឹក" },
                ]}
              />
            )}

            <FormError message={errors?.position} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <PhotoUpload
          file={formData.photoUpload ?? null}
          onChange={(f) => updateFormData({ photoUpload: f ?? null })}
        />
        {formData.photoUrl && (
          <div className="text-sm text-muted-foreground">បានផ្ទុកឡើង</div>
        )}
      </div>
      <FormError message={errors?.photoUpload} />

      {!hideContinue && (
        <Button
          className="w-full h-12 rounded-full"
          onClick={onNext}
          disabled={continueDisabled}
        >
          បន្ត
        </Button>
      )}
    </div>
  );
}
