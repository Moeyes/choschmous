/**
 * useDashboardData Hook
 * Custom hook for loading and managing dashboard data
 */

import { useState, useEffect, useMemo } from 'react'
import type {
  DashboardAthlete,
  DashboardEvent,
  DashboardSport,
  DashboardProvince,
  DashboardStats
} from '@/components/features/dashboard/types'
import {
  loadDashboardData,
  getDashboardStats
} from '@/data/dashboard'

interface UseDashboardDataOptions {
  eventId?: string | null
  autoLoad?: boolean
}

interface DashboardData {
  athletes: DashboardAthlete[]
  events: DashboardEvent[]
  sports: DashboardSport[]
  provinces: DashboardProvince[]
  stats: DashboardStats
  isLoading: boolean
  error: Error | null
  reload: () => void
}

/**
 * Hook for loading dashboard data
 * @param options Configuration options
 * @returns Dashboard data and utilities
 */
export function useDashboardData(options: UseDashboardDataOptions = {}): DashboardData {
  const { eventId, autoLoad = true } = options
  
  const [athletes, setAthletes] = useState<DashboardAthlete[]>([])
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [sports, setSports] = useState<DashboardSport[]>([])
  const [provinces, setProvinces] = useState<DashboardProvince[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = loadDashboardData(eventId ?? undefined)
      setAthletes(data.athletes)
      setEvents(data.events)
      setSports(data.sports)
      setProvinces(data.provinces)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoLoad) {
      loadData()
    }
  }, [eventId, autoLoad])

  const stats = useMemo<DashboardStats>(() => ({
    athletes: athletes.length,
    sports: sports.length,
    provinces: provinces.length,
    medals: 0, // No medal tracking yet
    events: events.length,
  }), [athletes, sports, provinces, events])

  return {
    athletes,
    events,
    sports,
    provinces,
    stats,
    isLoading,
    error,
    reload: loadData
  }
}
