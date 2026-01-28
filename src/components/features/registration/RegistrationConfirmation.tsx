/**
 * RegistrationConfirmation - Step 6
 * Shows a summary of all registration data for user to review before submitting
 */

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Edit2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { SectionTitle, FormError } from "@/src/components/ui/formElements";
import { validateForm, hasErrors } from "@/src/lib/validation/validators";
import { useUserSession } from "@/src/hooks/useUserSession";
import type { FormData as RegistrationFormData } from "@/src/types/registration";
import type { PositionInfo, OrganizationInfo } from "@/src/types/participation";
import { formatDateToKhmerLabeled, formatDateToDDMMYYYYKhmer, toKhmerDigits } from "@/src/lib/khmer";

interface RegistrationConfirmationProps {
  formData: RegistrationFormData;
  eventId: string;
  eventName?: string;
  onEdit: (step: number) => void;
  onSubmit: (registrationId: string) => void;
}

interface InfoRowProps {
  label: string;
  value?: string | null;
  editStep?: number;
  onEdit?: (step: number) => void;
}

function InfoRow({ label, value, editStep, onEdit }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{value || "—"}</span>
        {editStep && onEdit && (
          <button
            type="button"
            onClick={() => onEdit(editStep)}
            className="text-blue-500 hover:text-blue-700 p-1"
            aria-label={`Edit ${label}`}
          >
            <Edit2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function RegistrationConfirmation({
  formData,
  eventId,
  eventName,
  onEdit,
  onSubmit,
}: RegistrationConfirmationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, initializeSession } = useUserSession();

  // Initialize session on mount
  useEffect(() => {
    if (!session) {
      initializeSession();
    }
  }, [session, initializeSession]);

  const position = formData.position as PositionInfo | undefined;
  const organization = formData.organization as OrganizationInfo | undefined;

  const getPositionDisplay = () => {
    if (!position?.role) return null;
    if (position.role === "Athlete") {
      return position.athleteCategory === "Male" ? "កីឡាករ" : "កីឡាការិនី";
    }
    const leaderRoles: Record<string, string> = {
      coach: "ថ្នាក់ដឹកនាំ",
      manager: "គណកម្មការបច្ចេកទេស",
      delegate: "ប្រតិភូ",
      team_lead: "អ្នកដឹកនាំក្រុម",
      coach_trainer: "គ្រូបង្វឹក",
    };
    return leaderRoles[position.leaderRole ?? ""] ?? position.leaderRole;
  };

  const getOrganizationDisplay = () => {
    if (!organization) return null;
    return organization.name || organization.province || organization.department;
  };

  const getGenderDisplay = () => {
    if (formData.gender === "Male") return "ប្រុស";
    if (formData.gender === "Female") return "ស្រី";
    return formData.gender;
  };

  const getNationalityDisplay = () => {
    if (formData.nationality === "IDCard") return "អត្តសញ្ញាណប័ណ្ណ";
    if (formData.nationality === "BirthCertificate") return "វិញ្ញាបនបត្រកំណើត";
    return formData.nationality;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ensure we have a user session
      const userSession = session || initializeSession();
      
      // Validate before submit
      const errors = validateForm(formData);
      if (hasErrors(errors)) {
        const messages = Object.values(errors).filter(Boolean).join(" ");
        setError(messages || "សូមដោះស្រាយកំហុសក្នុងទម្រង់មុនពេលបញ្ចូន។");
        return;
      }

      const payload = { ...formData, eventId, userId: userSession.userId };
      const payloadToSend = { ...payload } as Record<string, unknown>;
      delete payloadToSend.photoUpload;

      let res: Response;

      if (formData.photoUpload) {
        const fd = new FormData();
        fd.append("payload", JSON.stringify(payloadToSend));
        fd.append("photo", formData.photoUpload as File);
        res = await fetch("/api/registrations", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSend),
        });
      }

      if (!res.ok) throw new Error("ការដាក់ស្នើការចុះឈ្មោះបរាជ័យ");
      const data = await res.json();
      onSubmit(data.registration?.id ?? data.id ?? "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "ការដាក់ស្នើបរាជ័យ";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <SectionTitle subtitle="សូមពិនិត្យព័ត៌មានរបស់អ្នកមុនបញ្ចូន">
        បញ្ជាក់ការចុះឈ្មោះ
      </SectionTitle>

      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>សូមពិនិត្យព័ត៌មានឱ្យបានត្រឹមត្រូវមុនពេលបញ្ជាក់</span>
      </div>

      {/* Event & Sport Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">ព្រឹត្តិការណ៍ និង កីឡា</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <InfoRow label="ព្រឹត្តិការណ៍" value={eventName} editStep={1} onEdit={onEdit} />
          <InfoRow label="កីឡា" value={formData.sport} editStep={2} onEdit={onEdit} />
          <InfoRow label="ប្រភេទ" value={formData.category} editStep={3} onEdit={onEdit} />
          <InfoRow label="តំណាង" value={getOrganizationDisplay()} editStep={4} onEdit={onEdit} />
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">ព័ត៌មានផ្ទាល់ខ្លួន</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <InfoRow
            label="ឈ្មោះ (ខ្មែរ)"
            value={`${formData.firstNameKh ?? ""} ${formData.lastNameKh ?? ""}`.trim() || null}
            editStep={5}
            onEdit={onEdit}
          />
          <InfoRow
            label="ឈ្មោះ (ឡាតាំង)"
            value={`${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim() || null}
            editStep={5}
            onEdit={onEdit}
          />
          <InfoRow label="ភេទ" value={getGenderDisplay()} editStep={5} onEdit={onEdit} />
          <InfoRow label="ថ្ងៃខែឆ្នាំកំណើត" value={formatDateToKhmerLabeled(formData.dateOfBirth)} editStep={5} onEdit={onEdit} />
          <InfoRow label="លេខអត្តសញ្ញាណជាតិ" value={toKhmerDigits(formData.nationalID)} editStep={5} onEdit={onEdit} />
          <InfoRow label="ប្រភេទឯកសារ" value={getNationalityDisplay()} editStep={5} onEdit={onEdit} />
          <InfoRow label="ទូរស័ព្ទ" value={toKhmerDigits(formData.phone)} editStep={5} onEdit={onEdit} />
          <InfoRow label="តួនាទី" value={getPositionDisplay()} editStep={5} onEdit={onEdit} />
          <InfoRow
            label="រូបថត"
            value={formData.photoUpload ? "បានផ្ទុកឡើង ✓" : "មិនទាន់បាន"}
            editStep={5}
            onEdit={onEdit}
          />
        </CardContent>
      </Card>

      {/* Photo Preview */}
      {formData.photoUpload && (
        <div className="flex justify-center">
          <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-slate-200">
            <img
              src={URL.createObjectURL(formData.photoUpload)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <FormError message={error} className="text-center" />

      {/* Actions */}
      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={() => onEdit(5)} disabled={loading}>
          កែសម្រួល
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary text-white min-w-37.5"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              កំពុងបញ្ជូន...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              បញ្ជាក់ និង ចុះឈ្មោះ
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
