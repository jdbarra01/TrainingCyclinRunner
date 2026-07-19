'use client'

import { useObjectivesStore } from '../store'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { useEffect, useMemo } from 'react'

export function useObjectives() {
  const { athlete } = useAthlete()
  const { objectives, addObjective, removeObjective } = useObjectivesStore()

  useEffect(() => {
    useObjectivesStore.getState().fetchAll()
  }, [])

  const athleteObjectives = useMemo(
    () => objectives.filter(o => o.athleteId === athlete?.id),
    [objectives, athlete?.id]
  )

  return {
    objectives: athleteObjectives,
    addObjective,
    removeObjective,
    activeObjectives: athleteObjectives.filter((o) => new Date(o.endDate) >= new Date()),
  }
}
