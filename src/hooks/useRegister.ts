/**
 * useRegister Hook
 * Handles participant registration form submission
 */

import { useState, useEffect, useRef } from "react";
import { emitDashboardRefresh } from "@/src/services/eventBus";
import { addParticipant } from "@/src/data/writer/dataWriter";
import type { FormData } from "@/src/types/registration";
import { toast } from 'sonner';

interface UseRegisterReturn {
  submitRegistration: (formData: FormData) => Promise<string | void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const reset = () => {
    if (isMountedRef.current) {
      setLoading(false);
      setError(null);
      setSuccess(false);
    }
  };

  const submitRegistration = async (formData: FormData): Promise<string | void> => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
        setSuccess(false);
      }

      // Map FormData to Participant format (includes role identity)
      const participantData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        firstNameKh: formData.firstNameKh || undefined,
        lastNameKh: formData.lastNameKh || undefined,
        dateOfBirth: formData.dateOfBirth,
        gender: (formData.gender === "Female" ? "Female" : "Male") as "Male" | "Female",
        nationality: formData.nationality || undefined,
        role: formData.position?.role || undefined,
        organization: formData.organization || undefined,
        sports: (formData.sports && formData.sports.length) ? formData.sports : (formData.sport ? [formData.sport] : []),
        sportCategory: formData.category ?? formData.sport ?? undefined,
        nationalID: formData.nationalID || undefined,
        phone: formData.phone || undefined,
        registrationDate: new Date().toISOString().split("T")[0],
        registeredAt: new Date().toISOString(),
        status: "approved" as const,
        medals: { gold: 0, silver: 0, bronze: 0 },
        photoUrl: formData.photoUpload
          ? URL.createObjectURL(formData.photoUpload)
          : "/avatars/default.jpg",
      };

      // Create participant via API
      const created = await addParticipant(participantData);

      if (isMountedRef.current) {
        setSuccess(true);
        // include created id in the refresh so listeners can act on it
        emitDashboardRefresh(created?.id ?? null);
        // show toast notification
        toast.success('Registration submitted');
      }

      // persist a minimal copy in sessionStorage so this browser session shows its own history
      try {
        const key = 'localParticipants';
        const raw = sessionStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const copy = {
          id: created?.id ?? String(Date.now()),
          firstName: created?.firstName ?? participantData.firstName,
          lastName: created?.lastName ?? participantData.lastName,
          registeredAt: created?.registeredAt ?? participantData.registeredAt
        };
        // dedupe by id
        const filtered = (arr as Array<{ id: string }>).filter((p) => p.id !== copy.id)
        filtered.unshift(copy)
        sessionStorage.setItem(key, JSON.stringify(filtered.slice(0, 50)))
      } catch {
        // Ignore sessionStorage errors
      }

      // return the created id so callers may navigate/open editor
      return created?.id; 
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return {
    submitRegistration,
    loading,
    error,
    success,
    reset,
  };
};
