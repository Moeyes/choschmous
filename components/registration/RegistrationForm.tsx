"use client"

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRegistrationForm } from "@/services/useRegistrationForm";
import { PersonalInfo } from "./sections/PersonalInfo";
import { LocationDetails } from "./sections/LocationDetails";
import { useRouter } from "next/navigation";
import type { FormData as RegistrationFormData } from "@/types/registration";
import type { TeamMember } from "@/types/team";

function MemberForm({ member, onChange, onRemove, index }: { member: TeamMember; onChange: (data: Partial<TeamMember>) => void; onRemove?: () => void; index: number }) {
  return (
    <div className="p-4 rounded-md border space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">សមាជិក {index + 1} {member.isLeader && <span className="text-sm text-muted-foreground">(មេក្រុម)</span>}</h3>
        {onRemove && !member.isLeader && (
          <button type="button" className="text-sm text-red-600" onClick={onRemove}>Remove</button>
        )}
      </div>

      <PersonalInfo
        formData={member as any}
        updateFormData={(d: Partial<TeamMember>) => onChange(d)}
        onNext={() => {}}
        hideContinue
      />
    </div>
  );
}

export function RegistrationForm() {
  const { formData, setField, reset, submit, loading, addMember, removeMember, updateMember } = useRegistrationForm();
  const router = useRouter();

  useEffect(() => {
    // ensure a captain exists when switching to team
    if (formData.registrationType === 'team' && (!formData.teamMembers || formData.teamMembers.length === 0)) {
      addMember({ isLeader: true } as any)
    }
  }, [formData.registrationType, formData.teamMembers, addMember]);

  const submitForm = async () => {
    await submit();
    reset();
    router.push("/?view=athletes");
  };

  const members: TeamMember[] = Array.isArray(formData.teamMembers) ? (formData.teamMembers as TeamMember[]) : [];
  const captain = members.find((m) => m.isLeader) ?? members[0];

  return (
    <form className="max-w-3xl mx-auto space-y-8 p-6 bg-white rounded-2xl shadow-sm">
      <LocationDetails selectedOrganization={formData.organization as any} onSelect={(organization) => setField({ organization })} />

      {/* Registration Type Selector */}
      <div className="flex gap-3">
        <Button variant={formData.registrationType === 'individual' ? 'default' : 'ghost'} onClick={() => setField({ registrationType: 'individual' })}>Individual</Button>
        <Button variant={formData.registrationType === 'team' ? 'default' : 'ghost'} onClick={() => setField({ registrationType: 'team' })}>Team</Button>
      </div>

      {formData.registrationType !== 'team' && (
        <PersonalInfo formData={formData as any} updateFormData={(d: Partial<RegistrationFormData>) => setField(d)} onNext={() => {}} />
      )}

      {formData.registrationType === 'team' && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Team Name</label>
            <input value={formData.teamName ?? ''} onChange={(e) => setField({ teamName: e.target.value })} className="mt-1 px-3 py-2 rounded-md border w-full" placeholder="Team name" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Captain</h2>
            {captain ? (
              <MemberForm member={captain} index={0} onChange={(data) => updateMember(captain.id ?? '', data)} />
            ) : (
              <div className="text-sm text-muted-foreground">No captain yet</div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button onClick={() => addMember()}>Add Team Member</Button>
            </div>

            <div className="space-y-4 mt-4">
              {members.map((m, i) => (
                <MemberForm key={m.id ?? i} member={m} index={i} onChange={(data) => updateMember(m.id ?? '', data)} onRemove={() => removeMember(m.id)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between sticky bottom-0 bg-white pt-6">
        <Button variant="ghost" onClick={reset}>Reset Form</Button>
        <Button className="bg-[#1a4cd8]" onClick={submitForm} disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
      </div>
    </form>
  );
}
