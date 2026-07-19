import { create } from 'zustand'
import type { Workout, TrainingPlan } from '@/types'

interface TrainingState {
  workouts: Workout[]
  plans: TrainingPlan[]
  activePlanId: string | null
  fetchAll: () => Promise<void>
  addWorkout: (workout: Workout) => Promise<void>
  updateWorkout: (id: string, data: Partial<Workout>) => Promise<void>
  updateWorkoutInPlans: (workoutId: string, data: Partial<Workout>) => Promise<void>
  removeWorkout: (id: string) => Promise<void>
  setActivePlan: (planId: string | null) => void
  addPlan: (plan: TrainingPlan) => Promise<void>
  removePlan: (id: string) => Promise<void>
}

export const useTrainingStore = create<TrainingState>((set) => ({
  workouts: [],
  plans: [],
  activePlanId: null,

  fetchAll: async () => {
    try {
      const [workoutsRes, plansRes] = await Promise.all([
        fetch('/api/workouts'),
        fetch('/api/training'),
      ])
      const workouts: Workout[] = await workoutsRes.json()
      const plans: TrainingPlan[] = await plansRes.json()
      set({ workouts, plans })
    } catch {
      // ignore
    }
  },

  addWorkout: async (workout) => {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    })
    const created: Workout = await res.json()
    set((state) => ({ workouts: [...state.workouts, created] }))
  },

  updateWorkout: async (id, data) => {
    await fetch('/api/workouts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, ...data } : w
      ),
    }))
  },

  updateWorkoutInPlans: async (workoutId, data) => {
    await fetch('/api/workouts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: workoutId, ...data }),
    })
    set((state) => ({
      plans: state.plans.map((plan) => ({
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
      })),
    }))
  },

  removeWorkout: async (id) => {
    await fetch(`/api/workouts?id=${id}`, { method: 'DELETE' })
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }))
  },

  setActivePlan: (planId) => set({ activePlanId: planId }),

  addPlan: async (plan) => {
    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    })
    const created: TrainingPlan = await res.json()
    set((state) => ({ plans: [...state.plans, created], activePlanId: created.id }))
  },

  removePlan: async (id) => {
    await fetch(`/api/training?id=${id}`, { method: 'DELETE' })
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
      activePlanId: state.activePlanId === id ? null : state.activePlanId,
    }))
  },
}))
