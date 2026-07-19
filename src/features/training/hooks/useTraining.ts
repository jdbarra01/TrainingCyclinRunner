'use client'

import { useTrainingStore } from '../store'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { useObjectives } from '@/features/objectives/hooks/useObjectives'
import { generateWorkout, generateTrainingPlan } from '../services/trainingCalculator'
import { useCallback, useEffect, useMemo } from 'react'
import type { WorkoutType } from '@/types'

export function useTraining() {
  const { workouts, plans, activePlanId, addWorkout, updateWorkoutInPlans, removeWorkout, addPlan, removePlan, setActivePlan } = useTrainingStore()
  const { athlete } = useAthlete()
  const { objectives } = useObjectives()

  useEffect(() => {
    useTrainingStore.getState().fetchAll()
  }, [])

  const athletePlans = useMemo(
    () => plans.filter(p => p.athleteId === athlete?.id),
    [plans, athlete?.id]
  )

  const createWorkout = useCallback(
    (type: WorkoutType, duration: number) => {
      if (!athlete) return null
      const workout = generateWorkout({ type, duration, ftp: athlete.ftp })
      addWorkout(workout)
      return workout
    },
    [athlete, addWorkout]
  )

  const createPlan = useCallback(
    (weeks: number = 4) => {
      if (!athlete || objectives.length === 0) return null
      const plan = generateTrainingPlan(objectives, athlete, weeks)
      addPlan({
        id: plan.id,
        name: plan.name,
        athleteId: athlete.id,
        objectiveIds: objectives.map(o => o.id),
        startDate: plan.weeks[0]?.weekStart ?? new Date().toISOString().split('T')[0],
        endDate: plan.weeks[plan.weeks.length - 1]?.weekStart ?? '',
        phase: 'base',
        weeks: plan.weeks.map(w => ({
          weekStart: w.weekStart,
          workouts: w.workouts,
          totalTss: w.workouts.reduce((sum, wo) => sum + wo.tss, 0),
          plannedTss: w.workouts.reduce((sum, wo) => sum + wo.tss, 0),
        })),
      })
      return plan
    },
    [athlete, objectives, addPlan]
  )

  const activePlan = athletePlans.find((p) => p.id === activePlanId) ?? athletePlans[0] ?? null

  return {
    workouts,
    plans: athletePlans,
    activePlan,
    activePlanId,
    createWorkout,
    createPlan,
    updateWorkoutInPlans,
    removeWorkout,
    removePlan,
    setActivePlan,
  }
}

export function useTrainingPlan() {
  const { athlete } = useAthlete()
  const { objectives } = useObjectives()

  const canGeneratePlan = athlete != null && athlete.name.trim() !== '' && objectives.length > 0

  return {
    canGeneratePlan,
    athlete,
    objectives,
  }
}
