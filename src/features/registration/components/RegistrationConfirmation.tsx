/**
 * RegistrationConfirmation - Step 6
 * Shows a summary of all registration data for user to review before submitting
 */

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { SectionTitle, FormError } from "@/src/components/ui/formElements"
import { StyledCard, InfoRow } from "@/src/shared/utils/patterns"
import { validateForm, hasErrors } from "@/src/lib/validation/validators"
import { useUserSession } from "@/src/hooks/useUserSession"
import { formatDateToKhmerLabeled, toKhmerDigits } from "@/src/lib/khmer"
import { getPositionDisplay, getGenderDisplay, getNationalityDisplay } from "@/src/lib/display"
import type { FormData as RegistrationFormData } from "@/src/types/registration"
import type { PositionInfo, OrganizationInfo } from "@/src/types/participation"

interface RegistrationConfirmationProps {
  formData: RegistrationFormData
  eventId: string
  eventName?: string
  onEdit: (step: number) => void
  onSubmit: (registrationId: string) => void
}

export function RegistrationConfirmation({
  formData,
  eventId,
  eventName,
  onEdit,
  onSubmit,
}: RegistrationConfirmationProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { session, initializeSession } = useUserSession()

  useEffect(() => {
    if (!session) initializeSession()
  }, [session, initializeSession])

  const position = formData.position as PositionInfo | undefined
  const organization = formData.organization as OrganizationInfo | undefined
  const orgDisplay = organization?.name || organization?.id || organization?.name
  const genderDisplay = getGenderDisplay(formData.gender)
  const nationalityDisplay = getNationalityDisplay(formData.nationality)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const userSession = session || initializeSession()
      const errors = validateForm(formData)
      
      if (hasErrors(errors)) {
        setError(Object.values(errors).filter(Boolean).join(" ") || "សូមដោះស្រាយកំហុសក្នុងទម្រង់មុនពេលបញ្ចូន។")
        return
      }

      const payload = { ...formData, eventId, userId: userSession.userId }
      const payloadToSend = { ...payload } as Record<string, unknown>
      delete payloadToSend.photoUpload

      let res: Response

      if (formData.photoUpload) {
        const fd = new FormData()
        fd.append("payload", JSON.stringify(payloadToSend))
        fd.append("photo", formData.photoUpload as File)
        res = await fetch("/api/registrations", { method: "POST", body: fd })
      } else {
        res = await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSend),
        })
      }

      if (!res.ok) throw new Error("ការដាក់ស្នើការចុះឈ្មោះបរាជ័យ")
      const data = await res.json()
      onSubmit(data.registration?.id ?? data.id ?? "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "ការដាក់ស្នើបរាជ័យ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <SectionTitle subtitle="សូមពិនិត្យព័ត៌មានរបស់អ្នកមុនបញ្ចូន">
        បញ្ជាក់ការចុះឈ្មោះ
      </SectionTitle>

      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>សូមពិនិត្យព័ត៌មានឱ្យបានត្រឹមត្រូវមុនពេលបញ្ជាក់</span>
      </div>

      <StyledCard title="ព្រឹត្តិការណ៍ និង កីឡា">
        <InfoRow label="ព្រឹត្តិការណ៍" value={eventName} onEdit={() => onEdit(1)} />
        <InfoRow label="កីឡា" value={formData.sport} onEdit={() => onEdit(2)} />
        <InfoRow label="ប្រភេទ" value={formData.category} onEdit={() => onEdit(3)} />
        <InfoRow label="តំណាង" value={orgDisplay} onEdit={() => onEdit(4)} />
      </StyledCard>

      <StyledCard title="ព័ត៌មានផ្ទាល់ខ្លួន">
        <InfoRow label="ឈ្មោះ (ខ្មែរ)" value={formData.fullNameKhmer} onEdit={() => onEdit(5)} />
        <InfoRow label="ឈ្មោះ (ឡាតាំង)" value={formData.fullNameEnglish} onEdit={() => onEdit(5)} />
        <InfoRow label="ភេទ" value={genderDisplay} onEdit={() => onEdit(5)} />
        <InfoRow label="ថ្ងៃខែឆ្នាំកំណើត" value={formatDateToKhmerLabeled(formData.dateOfBirth)} onEdit={() => onEdit(5)} />
        <InfoRow label="លេខអត្តសញ្ញាណជាតិ" value={toKhmerDigits(formData.nationalID)} onEdit={() => onEdit(5)} />
        <InfoRow label="ប្រភេទឯកសារ" value={nationalityDisplay} onEdit={() => onEdit(5)} />
        <InfoRow label="ទូរស័ព្ទ" value={toKhmerDigits(formData.phone)} onEdit={() => onEdit(5)} />
        <InfoRow label="តួនាទី" value={getPositionDisplay(position)} onEdit={() => onEdit(5)} />
        <InfoRow label="រូបថត" value={formData.photoUpload ? "បានផ្ទុកឡើង ✓" : "មិនទាន់បាន"} onEdit={() => onEdit(5)} />
      </StyledCard>

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

      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={() => onEdit(5)} disabled={loading}>
          កែសម្រួល
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="bg-primary text-white min-w-37.5">
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
  )
}
