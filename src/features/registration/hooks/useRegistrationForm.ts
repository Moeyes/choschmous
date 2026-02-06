import { useCallback, useState, useEffect } from "react";
import type {
  FormData as RegistrationFormData,
  FormErrors,
} from "@/types/registration";
import type { OrganizationInfo } from "@/types/participation";

import { useRegister as useSubmitRegister } from "./useRegister";
import { validateForm } from "@/lib/validation/validators";

// Helper function to load data from sessionStorage
const loadFromSessionStorage = (): Partial<RegistrationFormData> => {
  if (typeof window === "undefined") return {};

  const sport = sessionStorage.getItem("selectedSport");
  const category = sessionStorage.getItem("selectedCategory");
  const organizationStr = sessionStorage.getItem("selectedOrganization");

  let organization: OrganizationInfo | undefined;
  if (organizationStr) {
    try {
      organization = JSON.parse(organizationStr);
    } catch {
      organization = undefined;
    }
  }

  return {
    sport: sport || "",
    category: category || "",
    organization,
  };
};

export function useRegistrationForm(initial?: Partial<RegistrationFormData>) {
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>(
    () => ({
      sport: "",
      category: "",
      position: undefined,
      organization: undefined,
      phone: "",
      ...loadFromSessionStorage(),
      ...initial,
    }),
  );

  const [errors, setErrors] = useState<Partial<FormErrors>>({});

  // Sync with sessionStorage when component mounts or when storage changes
  useEffect(() => {
    const syncFromStorage = () => {
      const storageData = loadFromSessionStorage();
      setFormData((prev) => ({
        ...prev,
        ...storageData,
      }));
    };

    // Sync on mount
    syncFromStorage();

    // Listen for storage events (when data changes in another tab/window)
    window.addEventListener("storage", syncFromStorage);

    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  const setField = useCallback((data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));

    // Also persist to sessionStorage
    if (data.sport) sessionStorage.setItem("selectedSport", data.sport);
    if (data.category)
      sessionStorage.setItem("selectedCategory", data.category);
    if (data.organization) {
      sessionStorage.setItem(
        "selectedOrganization",
        JSON.stringify(data.organization),
      );
    }
  }, []);

  const reset = useCallback(() => {
    setFormData({
      sport: "",
      category: "",
      position: undefined,
      organization: undefined,
      phone: "",
    });
    setErrors({});
  }, []);

  const {
    submitRegistration,
    loading,
    error,
    success,
    reset: resetSubmitState,
  } = useSubmitRegister();

  const submit = useCallback(async () => {
    const payload = formData as RegistrationFormData;
    const id = await submitRegistration(payload);
    return id;
  }, [formData, submitRegistration]);

  const validate = useCallback(() => {
    const e = validateForm(formData as RegistrationFormData);
    setErrors(e);
    return e;
  }, [formData]);

  const clearErrors = useCallback(() => setErrors({}), []);
  const setFormErrors = useCallback(
    (e: Partial<FormErrors>) => setErrors(e),
    [],
  );

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
