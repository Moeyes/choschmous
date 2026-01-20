import { useCallback, useState } from "react";
import type { FormData as RegistrationFormData, FormErrors } from "@/types/registration";
import type { TeamMember } from "@/types/team";
import { useRegister as useSubmitRegister } from "./useRegister";
import { validateForm } from "@/lib/validation/validators";

function makeId() {
  return String(Date.now()) + String(Math.floor(Math.random() * 10000));
}

export function useRegistrationForm(initial?: Partial<RegistrationFormData>) {
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    sport: "",
    category: "",
    position: undefined,
    organization: undefined,
    phone: "",
    sports: [],
    registrationType: "individual",
    teamName: undefined,
    teamMembers: [],
    ...initial,
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});

  const setField = useCallback((data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const addMember = useCallback((member?: Partial<TeamMember>) => {
    setFormData((prev) => {
      const id = member?.id ?? makeId();
      const newMember: TeamMember = {
        id,
        firstName: member?.firstName ?? "",
        lastName: member?.lastName ?? "",
        firstNameKh: member?.firstNameKh ?? null,
        lastNameKh: member?.lastNameKh ?? null,
        nationalID: member?.nationalID ?? null,
        dateOfBirth: member?.dateOfBirth ?? null,
        gender: member?.gender ?? null,
        phone: member?.phone ?? null,
        position: (member as any)?.position ?? null,
        organization: member?.organization ?? null,
        photoUrl: member?.photoUrl ?? null,
        isLeader: !!member?.isLeader,
      };
      const members = Array.isArray(prev.teamMembers) ? [...prev.teamMembers, newMember] : [newMember];
      return { ...prev, teamMembers: members };
    });
  }, []);

  const removeMember = useCallback((id?: string) => {
    if (!id) return;
    setFormData((prev) => {
      const members = Array.isArray(prev.teamMembers) ? prev.teamMembers.filter((m) => m.id !== id) : [];
      return { ...prev, teamMembers: members };
    });
  }, []);

  const updateMember = useCallback((id: string, data: Partial<TeamMember>) => {
    setFormData((prev) => {
      const members = Array.isArray(prev.teamMembers)
        ? prev.teamMembers.map((m) => (m.id === id ? { ...m, ...data } : m))
        : [];
      return { ...prev, teamMembers: members };
    });
  }, []);

  const reset = useCallback(() => {
    setFormData({
      sport: "",
      category: "",
      position: undefined,
      organization: undefined,
      phone: "",
      sports: [],
      registrationType: "individual",
      teamName: undefined,
      teamMembers: [],
    });
    setErrors({});
  }, []);

  const { submitRegistration, loading, error, success, reset: resetSubmitState } = useSubmitRegister();

  const submit = useCallback(async () => {
    // Map our Partial<RegistrationFormData> to the expected FormData shape
    // The useRegister.submitRegistration expects FormData from types/registration
    const payload = formData as RegistrationFormData;
    await submitRegistration(payload);
  }, [formData, submitRegistration]);

  const validate = useCallback(() => {
    const e = validateForm(formData as RegistrationFormData);
    setErrors(e);
    return e;
  }, [formData]);

  const clearErrors = useCallback(() => setErrors({}), []);
  const setFormErrors = useCallback((e: Partial<FormErrors>) => setErrors(e), []);

  return {
    formData,
    setField,
    setFormData,
    reset,
    submit,
    loading,
    error,
    success,
    resetSubmitState,
    errors,
    validate,
    clearErrors,
    setFormErrors,
    // team helpers
    addMember,
    removeMember,
    updateMember,
  } as const;
}
