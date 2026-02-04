import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { SelectField } from "../SelectField";
import { PhotoUpload } from "../PhotoUpload";
import { FormError, SectionTitle } from "@/src/components/ui/formElements";
import type { FormData, FormErrors } from "@/src/types/registration";
import type {
  ParticipationGender,
  ParticipationNationality,
  PositionInfo,
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
  const hasName = !!(formData.fullNameKhmer || formData.fullNameEnglish);
  const continueDisabled = !hasName;

  const position = formData.position as PositionInfo | null | undefined;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <SectionTitle>ព័ត៌មានផ្ទាល់ខ្លួន</SectionTitle>
      <div>
        <Input
          placeholder="ឈ្មោះពេញ"
          value={formData.fullNameKhmer ?? ""}
          onChange={(e) => updateFormData({ fullNameKhmer: e.target.value })}
        />
      </div>
      <div>
        <Input
          placeholder="ឈ្មោះពេញ (អក្សរឡាតាំង)"
          value={formData.fullNameEnglish ?? ""}
          onChange={(e) => updateFormData({ fullNameEnglish: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            { value: "BirthCertificate", label: "សំបុត្របញ្ជាក់កំណើត" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div>
            <SelectField
              value={
                position?.role === "Leader" ? position.leaderRole : undefined
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
              options={[
                { value: "coach", label: "ថ្នាក់ដឹកនាំ" },
                { value: "manager", label: "គណកម្មការបច្ចេកទេស" },
                { value: "delegate", label: "ប្រតិភូ" },
                { value: "team_lead", label: "អ្នកដឹកនាំក្រុម" },
                { value: "coach_trainer", label: "គ្រូបង្វឹក" },
              ]}
              disabled={position?.role === "Athlete"}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
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
            <span className="text-sm font-medium">ជាកីឡាករ ឬ កីឡាការិនី</span>
          </div>
        </div>

        <FormError message={errors?.position} />
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
