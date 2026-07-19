import { create } from 'zustand'
import type { Workout, TrainingPlan } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'

interface TrainingState {
  workouts: Workout[]
  plans: TrainingPlan[]
  activePlanId: string | null
  loadFromStorage: () => void
  addWorkout: (workout: Workout) => void
  updateWorkout: (id: string, data: Partial<Workout>) => void
  updateWorkoutInPlans: (workoutId: string, data: Partial<Workout>) => void
  removeWorkout: (id: string) => void
  setActivePlan: (planId: string | null) => void
  addPlan: (plan: TrainingPlan) => void
  removePlan: (id: string) => void
}

export const useTrainingStore = create<TrainingState>((set) => ({
  workouts: [],
  plans: [],
  activePlanId: null,
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const storedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
        const storedPlans = localStorage.getItem(STORAGE_KEYS.TRAINING_PLANS)
        set({
          workouts: storedWorkouts ? JSON.parse(storedWorkouts) : [],
          plans: storedPlans ? JSON.parse(storedPlans) : [],
        })
      } catch {
        // ignore
      }
    }
  },
  addWorkout: (workout) => {
    set((state) => {
      const updated = [...state.workouts, workout]
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated))
      }
      return { workouts: updated }
    })
  },
  updateWorkout: (id, data) => {
    set((state) => {
      const updated = state.workouts.map((w) =>
        w.id === id ? { ...w, ...data } : w
      )
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated))
      }
      return { workouts: updated }
    })
  },
  updateWorkoutInPlans: (workoutId, data) => {
    set((state) => {
      const updated = state.plans.map((plan) => ({
        ...plan,
        weeks: plan.weeks.map((week) => ({
          ...week,
          workouts: week.workouts.map((w) =>
            w.id === workoutId ? { ...w, ...data } : w
          ),
          totalTss: week.workouts.some((w) => w.id === workoutId)
            ? week.workouts.reduce(
                (sum, w) => sum + (w.id === workoutId ? ({ ...w, ...data } as Workout).tss : w.tss),
                0
              )
            : week.totalTss,
        })),
      }))
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TRAINING_PLANS, JSON.stringify(updated))
      }
      return { plans: updated }
    })
  },
  removeWorkout: (id) => {
    set((state) => {
      const updated = state.workouts.filter((w) => w.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated))
      }
      return { workouts: updated }
    })
  },
  setActivePlan: (planId) => set({ activePlanId: planId }),
  addPlan: (plan) => {
    set((state) => {
      const updated = [...state.plans, plan]
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TRAINING_PLANS, JSON.stringify(updated))
      }
      return { plans: updated, activePlanId: plan.id }
    })
  },
  removePlan: (id) => {
    set((state) => {
      const updated = state.plans.filter((p) => p.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TRAINING_PLANS, JSON.stringify(updated))
      }
      return { plans: updated, activePlanId: state.activePlanId === id ? null : state.activePlanId }
    })
  },
}))
