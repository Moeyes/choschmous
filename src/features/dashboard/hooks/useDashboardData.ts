/**
 * useDashboardData Hook
 * Custom hook for loading and managing dashboard data
 * Focus: Participant and Event Management
 */

import { useState, useEffect, useCallback } from 'react'
import type {
  DashboardParticipant,
  DashboardEvent,
  DashboardSport,
  DashboardProvince,
  DashboardStats
} from '@/src/features/dashboard/types/types'

interface UseDashboardDataOptions {
  eventId?: string | null
  autoLoad?: boolean
}

interface DashboardData {
  participants: DashboardParticipant[]
  events: DashboardEvent[]
  sports: DashboardSport[]
  provinces: DashboardProvince[]
  stats: DashboardStats
  isLoading: boolean
  error: Error | null
  reload: () => void
}

/**
 * Hook for loading dashboard data from API
 * @param options Configuration options
 * @returns Dashboard data and utilities
 */
export function useDashboardData(options: UseDashboardDataOptions = {}): DashboardData {
  const { eventId, autoLoad = true } = options
  
  const [participants, setParticipants] = useState<DashboardParticipant[]>([])
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [sports, setSports] = useState<DashboardSport[]>([])
  const [provinces, setProvinces] = useState<DashboardProvince[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    participants: 0,
    sports: 0,
    provinces: 0,
    events: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const url = eventId 
        ? `/api/dashboard?eventId=${encodeURIComponent(eventId)}`
        : '/api/dashboard'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      
      // Support both old 'athletes' and new 'participants' keys from API
      setParticipants(data.participants || data.athletes || [])
      setEvents(data.events || [])
      setSports(data.sports || [])
      setProvinces(data.provinces || [])
      setStats(data.stats || {
        participants: 0,
        sports: 0,
        provinces: 0,
        events: 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'))
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    if (autoLoad) {
      loadData()
    }
  }, [autoLoad, loadData])

  return {
    participants,
    events,
    sports,
    provinces,
    stats,
    isLoading,
    error,
    reload: loadData
  }
}

