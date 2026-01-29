"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, Upload, ChevronRight, ChevronLeft } from "lucide-react"

type RegistrationData = {
  firstName: string
  lastName: string
  firstNameKh: string
  lastNameKh: string
  gender: string
  dateOfBirth: string
  province: string
  sport: string
  position: string
  email: string
  phone: string
  photoUrl?: string
}

type RegisterEnrollPageProps = {
  onSubmit?: (data: RegistrationData) => void
  sports?: string[]
  provinces?: string[]
}

const SAMPLE_SPORTS = ["Boxing", "Swimming", "Athletics", "Basketball", "Badminton", "Football"]
const SAMPLE_PROVINCES = ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kandal"]

export function RegisterEnrollPage({
  onSubmit,
  sports = SAMPLE_SPORTS,
  provinces = SAMPLE_PROVINCES,
}: RegisterEnrollPageProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    firstNameKh: "",
    lastNameKh: "",
    gender: "",
    dateOfBirth: "",
    province: "",
    sport: "",
    position: "Athlete",
    email: "",
    phone: "",
  })

  const handleChange = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
    console.log("Registration submitted:", formData)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Athlete Registration</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Bilingual form (English + Khmer) for participant registration
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s ? "bg-[#1a4cd8] text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-slate-800" : "text-slate-400"}`}>
                {s === 1 ? "Personal Info" : s === 2 ? "Sport Details" : "Review"}
              </span>
              {s < 3 && <div className="h-px w-16 bg-slate-200" />}
            </div>
          ))}
        </div>

        <Card className="border-none shadow-sm rounded-2xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name (English)</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name (English)</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstNameKh">First Name (Khmer)</Label>
                  <Input
                    id="firstNameKh"
                    value={formData.firstNameKh}
                    onChange={(e) => handleChange("firstNameKh", e.target.value)}
                    placeholder="បញ្ចូលនាមខ្លួន"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastNameKh">Last Name (Khmer)</Label>
                  <Input
                    id="lastNameKh"
                    value={formData.lastNameKh}
                    onChange={(e) => handleChange("lastNameKh", e.target.value)}
                    placeholder="បញ្ចូលនាមត្រកូល"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="h-11 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter email"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Sport Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <select
                    id="province"
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                    className="h-11 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <select
                    id="sport"
                    value={formData.sport}
                    onChange={(e) => handleChange("sport", e.target.value)}
                    className="h-11 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    <option value="">Select sport</option>
                    {sports.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    className="h-11 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    <option value="Athlete">Athlete</option>
                    <option value="Leader">Leader</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-sm font-medium text-slate-600 mb-2">Upload Photo</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Full Name</p>
                  <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Name (Khmer)</p>
                  <p className="font-medium">{formData.firstNameKh} {formData.lastNameKh}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Gender</p>
                  <p className="font-medium">{formData.gender || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Date of Birth</p>
                  <p className="font-medium">{formData.dateOfBirth || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Province</p>
                  <p className="font-medium">{formData.province || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Sport</p>
                  <p className="font-medium">{formData.sport || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Email</p>
                  <p className="font-medium">{formData.email || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase">Phone</p>
                  <p className="font-medium">{formData.phone || "-"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="rounded-xl gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {step < 3 ? (
              <Button onClick={nextStep} className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl gap-2">
                Submit Registration
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterEnrollPage
