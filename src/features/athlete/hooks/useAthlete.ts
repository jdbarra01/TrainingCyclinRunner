'use client'

import { useAthleteStore } from '../store'
import { useEffect, useCallback, useMemo } from 'react'
import type { Athlete } from '@/types'

export function useAthlete() {
  const athletes = useAthleteStore((s) => s.athletes)
  const activeAthleteId = useAthleteStore((s) => s.activeAthleteId)
  const isLoading = useAthleteStore((s) => s.isLoading)
  const store = useAthleteStore()

  useEffect(() => {
    store.fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const athlete = useMemo(
    () => athletes.find(a => a.id === activeAthleteId) ?? null,
    [athletes, activeAthleteId]
  )

  const setAthlete = useCallback(
    (data: Athlete) => {
      const existing = athletes.find(a => a.id === data.id)
      if (existing) {
        store.updateAthlete(data.id, data)
      } else {
        const { id: _, ...rest } = data
        store.addAthlete(rest)
      }
    },
    [athletes, store]
  )

  const clearAthlete = useCallback(() => {
    if (athlete) store.removeAthlete(athlete.id)
  }, [athlete, store])

  const switchAthlete = useCallback(
    (id: string) => store.setActiveAthlete(id),
    [store]
  )

  return {
    athlete,
    athletes,
    isLoading,
    setAthlete,
    clearAthlete,
    switchAthlete,
    addAthlete: store.addAthlete,
    removeAthlete: store.removeAthlete,
    isComplete: athlete != null && athlete.name.trim() !== '',
  }
}
