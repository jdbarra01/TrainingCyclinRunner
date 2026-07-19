import { create } from 'zustand'
import type { TrainingObjective } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'

interface ObjectivesState {
  objectives: TrainingObjective[]
  loadFromStorage: () => void
  addObjective: (objective: TrainingObjective) => void
  updateObjective: (id: string, data: Partial<TrainingObjective>) => void
  removeObjective: (id: string) => void
}

export const useObjectivesStore = create<ObjectivesState>((set) => ({
  objectives: [],
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.OBJECTIVES)
        if (stored) set({ objectives: JSON.parse(stored) })
      } catch {
        // ignore
      }
    }
  },
  addObjective: (objective) => {
    set((state) => {
      const updated = [...state.objectives, objective]
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.OBJECTIVES, JSON.stringify(updated))
      }
      return { objectives: updated }
    })
  },
  updateObjective: (id, data) => {
    set((state) => {
      const updated = state.objectives.map((o) =>
        o.id === id ? { ...o, ...data } : o
      )
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.OBJECTIVES, JSON.stringify(updated))
      }
      return { objectives: updated }
    })
  },
  removeObjective: (id) => {
    set((state) => {
      const updated = state.objectives.filter((o) => o.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.OBJECTIVES, JSON.stringify(updated))
      }
      return { objectives: updated }
    })
  },
}))
