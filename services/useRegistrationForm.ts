import { useCallback, useState } from "react";
import type { FormData as RegistrationFormData, FormErrors } from "@/types/registration";

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
    ...initial,
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});

  const setField = useCallback((data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const reset = useCallback(() => {
    setFormData({
      sport: "",
      category: "",
      position: undefined,
      organization: undefined,
      phone: "",
      sports: [],
    });
    setErrors({});
  }, []);

  const { submitRegistration, loading, error, success, reset: resetSubmitState } = useSubmitRegister();

  const submit = useCallback(async () => {
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
  } as const;
}
