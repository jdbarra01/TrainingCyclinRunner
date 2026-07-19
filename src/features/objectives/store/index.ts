import { create } from 'zustand'
import type { TrainingObjective } from '@/types'

interface ObjectivesState {
  objectives: TrainingObjective[]
  fetchAll: () => Promise<void>
  addObjective: (objective: TrainingObjective) => Promise<void>
  updateObjective: (id: string, data: Partial<TrainingObjective>) => Promise<void>
  removeObjective: (id: string) => Promise<void>
}

export const useObjectivesStore = create<ObjectivesState>((set) => ({
  objectives: [],

  fetchAll: async () => {
    try {
      const res = await fetch('/api/objectives')
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (Array.isArray(data)) set({ objectives: data })
    } catch {
      // ignore
    }
  },

  addObjective: async (objective) => {
    const res = await fetch('/api/objectives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objective),
    })
    const created: TrainingObjective = await res.json()
    set((state) => ({ objectives: [...state.objectives, created] }))
  },

  updateObjective: async (id, data) => {
    await fetch('/api/objectives', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    set((state) => ({
      objectives: state.objectives.map((o) =>
        o.id === id ? { ...o, ...data } : o
      ),
    }))
  },

  removeObjective: async (id) => {
    await fetch(`/api/objectives?id=${id}`, { method: 'DELETE' })
    set((state) => ({
      objectives: state.objectives.filter((o) => o.id !== id),
    }))
  },
}))
