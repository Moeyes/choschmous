/**
 * useRegister Hook
 * Handles participant registration form submission
 */

import { useCallback } from 'react'
import { toast } from 'sonner'
import { emitDashboardRefresh } from '@/src/core/events/eventBus'
import { addParticipant } from '@/src/shared/utils/writer/dataWriter'
import { formDataToParticipant, toSessionParticipant } from '@/src/lib/transformers'
import { session } from '@/src/lib/api'
import { useAsync } from '@/src/lib/hooks'
import type { FormData } from '@/src/types/registration'

interface UseRegisterReturn {
  submitRegistration: (formData: FormData) => Promise<string | void>
  loading: boolean
  error: string | null
  success: boolean
  reset: () => void
}

const SESSION_KEY = 'localParticipants'

export const useRegister = (): UseRegisterReturn => {
  const { loading, error, success, reset, execute } = useAsync()

  const submitRegistration = useCallback(
    async (formData: FormData): Promise<string | void> => {
      const result = await execute(async () => {
        // Transform form data
        const photoUrl = formData.photoUpload
          ? URL.createObjectURL(formData.photoUpload)
          : undefined
        const participantData = formDataToParticipant(formData, photoUrl)

        // Create participant via API
        const created = await addParticipant(participantData)

        // Emit refresh event
        emitDashboardRefresh(created?.id ?? null)
        toast.success('Registration submitted')

        // Save to session storage
        if (created) {
          session.update<{ id: string }>(SESSION_KEY, (arr) => {
            const copy = toSessionParticipant(created)
            const filtered = arr.filter((p) => p.id !== copy.id)
            return [copy, ...filtered].slice(0, 50)
          })
        }

        return created?.id
      })
      return result as string | void
    },
    [execute]
  )

  return {
    submitRegistration,
    loading,
    error,
    success,
    reset,
  };
};
