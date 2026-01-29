"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, X, Upload, User } from "lucide-react"
import { useDashboardData } from "../hooks/useDashboardData"
import type { DashboardAthlete } from "./types"
import { EditableInputField, EditableSelectField } from "./EditableField"
import { formatDateToDDMMYYYYKhmer, toKhmerDigits } from "@/src/lib/khmer"

interface ParticipantEditDialogProps {
  participant: DashboardAthlete | null
  open: boolean
  onClose: () => void
  onSave: (participant: DashboardAthlete) => void
}

export function ParticipantEditDialog({ 
  participant, 
  open, 
  onClose, 
  onSave 
}: ParticipantEditDialogProps) {
  const { events, sports: allSports } = useDashboardData()
  const [formData, setFormData] = useState<Partial<DashboardAthlete>>({})
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [organizations, setOrganizations] = useState<Array<{id: string, name: string, khmerName: string, type: string}>>([])
  const [sports, setSports] = useState<any[]>([])
  const [selectedSportCategories, setSelectedSportCategories] = useState<string[]>([])
  const [editingField, setEditingField] = useState<string | null>(null)

  useEffect(() => {
    // Load organizations from API
    async function loadOrganizations() {
      try {
        const response = await fetch('/api/organizations')
        const data = await response.json()
        setOrganizations(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load organizations:', error)
        setOrganizations([])
      }
    }
    loadOrganizations()
  }, [])

  useEffect(() => {
    // Load sports from events or allSports
    if (events.length > 0 && events[0]?.sports) {
      setSports(events[0].sports)
    } else if (allSports && allSports.length > 0) {
      setSports(allSports)
    } else {
      // Fallback: try to fetch from API
      async function loadSports() {
        try {
          const response = await fetch('/api/events')
          const data = await response.json()
          if (data && data.length > 0 && data[0].sports) {
            setSports(data[0].sports)
          }
        } catch (error) {
          console.error('Failed to load sports:', error)
        }
      }
      loadSports()
    }
  }, [events, allSports])

  useEffect(() => {
    if (participant) {
      setFormData(participant)
      setPhotoPreview(participant.photoUrl || "")
      
      // Load sport categories based on selected sport
      if (sports.length > 0) {
        // Try to find sport by ID first, then by name
        const sport = sports.find((s: any) => 
          s.id === participant.sportId || s.name === participant.sport
        )
        if (sport) {
          // Ensure sportId is set
          if (!participant.sportId) {
            setFormData(prev => ({
              ...prev,
              sportId: sport.id,
              sport: sport.name
            }))
          }
          // Set categories
          if (sport.categories) {
            setSelectedSportCategories(sport.categories)
          }
        }
      }
      
      // Match organization from province name if organization object is not set
      if (participant.province && !participant.organization?.id && organizations.length > 0) {
        const org = organizations.find(o => o.khmerName === participant.province || o.name === participant.province)
        if (org) {
          setFormData(prev => ({
            ...prev,
            organization: {
              id: org.id,
              name: org.khmerName,
              type: org.type
            }
          }))
        }
      }
    }
  }, [participant, sports, organizations])

  const handleChange = (field: keyof DashboardAthlete, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Update sport categories when sport changes
    if (field === 'sportId' && sports.length > 0) {
      const sport = sports.find((s: any) => s.id === value)
      if (sport) {
        setSelectedSportCategories(sport.categories || [])
        setFormData(prev => ({ ...prev, sport: sport.name, sportId: value }))
      }
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        setFormData(prev => ({ ...prev, photoUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (participant && formData) {
      onSave({ ...participant, ...formData } as DashboardAthlete)
      setEditingField(null)
      onClose()
    }
  }

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName)
  }

  const handleFieldBlur = () => {
    // Keep field editing state until user clicks another field or saves
  }

  if (!participant) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">កែប្រែអ្នកចូលរួម</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">រូបថត (សមាមាត្រ 4x6)</Label>
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-slate-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-sm text-slate-600">
                <p className="font-medium mb-1">បញ្ចូលរូបថត</p>
                <p className="text-xs">ណែនាំ: សមាមាត្រ 4x6 (ឧ. 800x1200px)</p>
                <p className="text-xs text-slate-500">JPG, PNG រហូតដល់ 5MB</p>
              </div>
            </div>
          </div>

          {/* Personal Information - Khmer & English Names */}
          <EditableInputField
            id="fullNameKhmer"
            label="ឈ្មោះពេញ (ខ្មែរ)"
            value={formData.fullNameKhmer}
            placeholder="ឈ្មោះពេញជាភាសាខ្មែរ"
            isEditing={editingField === "fullNameKhmer"}
            onEdit={() => handleFieldClick("fullNameKhmer")}
            onChange={(val) => handleChange("fullNameKhmer", val)}
            onBlur={handleFieldBlur}
          />
          
          <EditableInputField
            id="fullNameEnglish"
            label="ឈ្មោះពេញ (អង់គ្លេស)"
            value={formData.fullNameEnglish}
            placeholder="Full Name in English"
            isEditing={editingField === "fullNameEnglish"}
            onEdit={() => handleFieldClick("fullNameEnglish")}
            onChange={(val) => {
              handleChange("fullNameEnglish", val)
              handleChange("name", val) // Also update name field
            }}
            onBlur={handleFieldBlur}
          />

          <div className="grid grid-cols-2 gap-4">
            <EditableSelectField
              id="gender"
              label="ភេទ"
              value={formData.gender}
              displayValue={formData.gender === "Male" ? "ប្រុស" : formData.gender === "Female" ? "ស្រី" : "គ្មាន"}
              options={[
                { value: "Male", label: "ប្រុស" },
                { value: "Female", label: "ស្រី" }
              ]}
              required
              isEditing={editingField === "gender"}
              onEdit={() => handleFieldClick("gender")}
              onChange={(val) => handleChange("gender", val)}
              onBlur={handleFieldBlur}
            />
            <EditableSelectField
              id="nationality"
              label="ប្រភេទឯកសារជាតិសញ្ជាតិ"
              value={formData.nationality}
              displayValue={formData.nationality === "IDCard" ? "អត្តសញ្ញាណប័ណ្ណ" : formData.nationality === "BirthCertificate" ? "វិញ្ញាបនបត្រកំណើត" : "គ្មាន"}
              options={[
                { value: "IDCard", label: "អត្តសញ្ញាណប័ណ្ណ" },
                { value: "BirthCertificate", label: "វិញ្ញាបនបត្រកំណើត" }
              ]}
              required
              isEditing={editingField === "nationality"}
              onEdit={() => handleFieldClick("nationality")}
              onChange={(val) => handleChange("nationality", val)}
              onBlur={handleFieldBlur}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">ថ្ងៃខែឆ្នាំកំណើត</Label>
              {editingField === "dateOfBirth" ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  onBlur={handleFieldBlur}
                  className="h-11"
                  autoFocus
                  required
                />
              ) : (
                <div
                  onClick={() => handleFieldClick("dateOfBirth")}
                  className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700">{formatDateToDDMMYYYYKhmer(formData.dateOfBirth) || "គ្មាន"}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalID">លេខអត្តសញ្ញាណជាតិ</Label>
              {editingField === "nationalID" ? (
                <Input
                  id="nationalID"
                  value={formData.nationalID || ""}
                  onChange={(e) => handleChange("nationalID", e.target.value)}
                  onBlur={handleFieldBlur}
                  className="h-11"
                  placeholder="លេខអត្តសញ្ញាណជាតិ"
                  autoFocus
                  required
                />
              ) : (
                <div
                  onClick={() => handleFieldClick("nationalID")}
                  className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700">{formData.nationalID || "គ្មាន"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="phone">ទូរស័ព្ទ</Label>
            {editingField === "phone" ? (
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={handleFieldBlur}
                className="h-11"
                placeholder="012345678"
                autoFocus
              />
            ) : (
              <div
                onClick={() => handleFieldClick("phone")}
                className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <span className="text-slate-700">{toKhmerDigits(formData.phone) || "គ្មាន"}</span>
              </div>
            )}
          </div>

          {/* Position Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">តួនាទី</Label>
              {editingField === "position" ? (
                <select
                  id="position"
                  value={formData.position?.role || ""}
                  onChange={(e) => handleChange("position", { ...formData.position, role: e.target.value })}
                  onBlur={handleFieldBlur}
                  className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                  autoFocus
                  required
                >
                  <option value="">ជ្រើសរើសតួនាទី</option>
                  <option value="Athlete">កីឡាករ/កីឡាការិនី</option>
                  <option value="Leader">អ្នកដឹកនាំ</option>
                </select>
              ) : (
                <div
                  onClick={() => handleFieldClick("position")}
                  className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700">
                    {formData.position?.role === "Athlete" ? "កីឡាករ/កីឡាការិនី" : formData.position?.role === "Leader" ? "អ្នកដឹកនាំ" : "គ្មាន"}
                  </span>
                </div>
              )}
            </div>
            {formData.position?.role === "Athlete" && (
              <div className="space-y-2">
                <Label htmlFor="athleteCategory">ប្រភេទកីឡាករ</Label>
                {editingField === "athleteCategory" ? (
                  <select
                    id="athleteCategory"
                    value={formData.position?.category || ""}
                    onChange={(e) => handleChange("position", { ...formData.position, category: e.target.value })}
                    onBlur={handleFieldBlur}
                    className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                    autoFocus
                    required
                  >
                    <option value="">ជ្រើសរើសប្រភេទ</option>
                    <option value="Male">កីឡាករ</option>
                    <option value="Female">កីឡាការិនី</option>
                  </select>
                ) : (
                  <div
                    onClick={() => handleFieldClick("athleteCategory")}
                    className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-slate-700">
                      {formData.position?.category === "Male" ? "កីឡាករ" : formData.position?.category === "Female" ? "កីឡាការិនី" : "គ្មាន"}
                    </span>
                  </div>
                )}
              </div>
            )}
            {formData.position?.role === "Leader" && (
              <div className="space-y-2">
                <Label htmlFor="leaderRole">ជ្រើសតួនាទី</Label>
                {editingField === "leaderRole" ? (
                  <select
                    id="leaderRole"
                    value={formData.position?.leaderRole || ""}
                    onChange={(e) => handleChange("position", { ...formData.position, leaderRole: e.target.value })}
                    onBlur={handleFieldBlur}
                    className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                    autoFocus
                    required
                  >
                    <option value="">ជ្រើសតួនាទី</option>
                    <option value="coach">ថ្នាក់ដឹកនាំ</option>
                    <option value="manager">គណកម្មការបច្ចេកទេស</option>
                    <option value="delegate">ប្រតិភូ</option>
                    <option value="team_lead">អ្នកដឹកនាំក្រុម</option>
                    <option value="coach_trainer">គ្រូបង្វឹក</option>
                  </select>
                ) : (
                  <div
                    onClick={() => handleFieldClick("leaderRole")}
                    className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-slate-700">
                      {formData.position?.leaderRole === "coach" ? "ថ្នាក់ដឹកនាំ" : 
                       formData.position?.leaderRole === "manager" ? "គណកម្មការបច្ចេកទេស" : 
                       formData.position?.leaderRole === "delegate" ? "ប្រតិភូ" : 
                       formData.position?.leaderRole === "team_lead" ? "អ្នកដឹកនាំក្រុម" : 
                       formData.position?.leaderRole === "coach_trainer" ? "គ្រូបង្វឹក" : 
                       "គ្មាន"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Organization & Sport */}
          <div className="space-y-2">
            <Label htmlFor="organization">តំណាង</Label>
            {editingField === "organization" ? (
              <select
                id="organization"
                value={formData.organization?.id || ""}
                onChange={(e) => {
                  const org = organizations.find(o => o.id === e.target.value)
                  if (org) {
                    const orgType = String(org.type).toLowerCase()
                    handleChange("organization", {
                      id: org.id,
                      name: org.khmerName,
                      type: orgType,
                      ...(orgType === 'province' ? { province: org.khmerName } : { department: org.khmerName })
                    })
                    handleChange("province", org.khmerName)
                  }
                }}
                onBlur={handleFieldBlur}
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                autoFocus
                required
              >
                <option value="">ជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក</option>
                {organizations
                  .filter(o => String(o.type).toLowerCase() === 'ministry')
                  .map(org => (
                    <option key={org.id} value={org.id}>
                      {org.khmerName}
                    </option>
                  ))}
                {organizations
                  .filter(o => String(o.type).toLowerCase() === 'province')
                  .map(org => (
                    <option key={org.id} value={org.id}>
                      {org.khmerName}
                    </option>
                  ))}
              </select>
            ) : (
              <div
                onClick={() => handleFieldClick("organization")}
                className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <span className="text-slate-700">{formData.organization?.name || formData.province || "គ្មាន"}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport">កីឡា</Label>
            {editingField === "sport" ? (
              <select
                id="sport"
                value={formData.sportId || ""}
                onChange={(e) => handleChange("sportId", e.target.value)}
                onBlur={handleFieldBlur}
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                autoFocus
                required
              >
                <option value="">ជ្រើសប្រកួតដែលអ្នកចង់ចូលរួម</option>
                {sports
                  ?.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'km'))
                  .map((sport: any) => (
                    <option key={sport.id} value={sport.id}>{sport.name}</option>
                  ))}
              </select>
            ) : (
              <div
                onClick={() => handleFieldClick("sport")}
                className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <span className="text-slate-700">{formData.sport || "គ្មាន"}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sportCategory">ប្រភេទកីឡា</Label>
            {editingField === "sportCategory" ? (
              selectedSportCategories.length > 0 ? (
                <select
                  id="sportCategory"
                  value={formData.sportCategory || ""}
                  onChange={(e) => handleChange("sportCategory", e.target.value)}
                  onBlur={handleFieldBlur}
                  className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  required
                >
                  <option value="">ជ្រើសរើសប្រភេទ</option>
                  {selectedSportCategories
                    .sort((a: string, b: string) => a.localeCompare(b, 'km'))
                    .map((category: string) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                </select>
              ) : (
                <div className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center text-slate-400">
                  សូមជ្រើសរើសប្រភេទកីឡាជាមុនសិន
                </div>
              )
            ) : (
              <div
                onClick={() => handleFieldClick("sportCategory")}
                className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <span className="text-slate-700">{formData.sportCategory || "គ្មាន"}</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">ស្ថានភាព</Label>
            {editingField === "status" ? (
              <select
                id="status"
                value={formData.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
                onBlur={handleFieldBlur}
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
                autoFocus
                required
              >
                <option value="pending">កំពុងរងចាំ</option>
                <option value="approved">អនុម័ត</option>
                <option value="rejected">បដិសេធ</option>
              </select>
            ) : (
              <div
                onClick={() => handleFieldClick("status")}
                className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <span className="text-slate-700">
                  {formData.status === "approved" ? "អនុម័ត" : formData.status === "pending" ? "កំពុងរងចាំ" : formData.status === "rejected" ? "បដិសេធ" : "គ្មាន"}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              បោះបង់
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              រក្សាទុកការផ្លាស់ប្តូរ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
