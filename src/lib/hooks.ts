/**
 * Common Hook Utilities
 * Reusable hook patterns and utilities
 */

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook for managing mounted state to prevent state updates on unmounted components
 */
export function useMounted() {
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return mountedRef
}

/**
 * Hook for managing async operations with loading/error states
 */
export function useAsync<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const mounted = useMounted()

  const reset = useCallback(() => {
    if (mounted.current) {
      setLoading(false)
      setError(null)
      setSuccess(false)
    }
  }, [mounted])

  const execute = useCallback(
    async (asyncFn: () => Promise<T>): Promise<T | undefined> => {
      try {
        if (mounted.current) {
          setLoading(true)
          setError(null)
          setSuccess(false)
        }

        const result = await asyncFn()

        if (mounted.current) {
          setSuccess(true)
        }

        return result
      } catch (err) {
        if (mounted.current) {
          const errorMessage = err instanceof Error ? err.message : 'Operation failed'
          setError(errorMessage)
        }
        throw err
      } finally {
        if (mounted.current) {
          setLoading(false)
        }
      }
    },
    [mounted]
  )

  return { loading, error, success, reset, execute }
}

/**
 * Hook for managing form state
 */
export function useFormState<T extends Record<string, unknown>>(
  initialState: T
) {
  const [data, setData] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const setField = useCallback((field: keyof T, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  const setFields = useCallback((fields: Partial<T>) => {
    setData(prev => ({ ...prev, ...fields }))
  }, [])

  const reset = useCallback(() => {
    setData(initialState)
    setErrors({})
  }, [initialState])

  const clearErrors = useCallback(() => setErrors({}), [])

  return {
    data,
    setData,
    setField,
    setFields,
    errors,
    setErrors,
    reset,
    clearErrors,
  }
}
