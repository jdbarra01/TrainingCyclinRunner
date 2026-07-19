'use client'

import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { useObjectives } from '@/features/objectives/hooks/useObjectives'
import { useTraining } from '@/features/training/hooks/useTraining'
import { useMemo } from 'react'
import { getWeekStart } from '@/lib/utils'

export function useDashboard() {
  const { athlete, isLoading: athleteLoading } = useAthlete()
  const { objectives, activeObjectives } = useObjectives()
  const { plans, activePlan, workouts } = useTraining()

  const weekStart = getWeekStart()

  const weekWorkouts = useMemo(() => {
    if (!activePlan) return []
    const currentWeek = activePlan.weeks.find(w => w.weekStart === weekStart)
    return currentWeek?.workouts ?? []
  }, [activePlan, weekStart])

  const weekProgress = useMemo(() => {
    if (weekWorkouts.length === 0) return 0
    return Math.round((workouts.filter(w => weekWorkouts.some(wk => wk.id === w.id)).length / weekWorkouts.length) * 100)
  }, [weekWorkouts, workouts])

  const weeklyTss = useMemo(() => {
    return weekWorkouts.reduce((sum, w) => sum + w.tss, 0)
  }, [weekWorkouts])

  const upcomingWorkout = useMemo(() => {
    return weekWorkouts[0] ?? null
  }, [weekWorkouts])

  return {
    athlete,
    athleteLoading,
    objectives,
    activeObjectives,
    activePlan,
    weekWorkouts,
    weekProgress,
    weeklyTss,
    upcomingWorkout,
    hasData: athlete !== null || objectives.length > 0 || plans.length > 0,
  }
}
