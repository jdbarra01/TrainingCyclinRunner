import { create } from 'zustand'
import type { Athlete } from '@/types'

interface AthleteState {
  athletes: Athlete[]
  activeAthleteId: string | null
  isLoading: boolean
  addAthlete: (data: Omit<Athlete, 'id'>) => Promise<Athlete>
  updateAthlete: (id: string, data: Partial<Omit<Athlete, 'id'>>) => Promise<void>
  removeAthlete: (id: string) => Promise<void>
  setActiveAthlete: (id: string) => void
  fetchAll: () => Promise<void>
}

export const useAthleteStore = create<AthleteState>((set, get) => ({
  athletes: [],
  activeAthleteId: null,
  isLoading: true,

  addAthlete: async (data) => {
    const res = await fetch('/api/athlete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error de conexión con el servidor' }))
      throw new Error(err.error || 'Error al crear atleta')
    }
    const athlete: Athlete = await res.json()
    set((state) => ({
      athletes: [...state.athletes, athlete],
      activeAthleteId: athlete.id,
    }))
    return athlete
  },

  updateAthlete: async (id, data) => {
    await fetch('/api/athlete', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    set((state) => ({
      athletes: state.athletes.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    }))
  },

  removeAthlete: async (id) => {
    await fetch(`/api/athlete?id=${id}`, { method: 'DELETE' })
    set((state) => {
      const updated = state.athletes.filter((a) => a.id !== id)
      const newActive = state.activeAthleteId === id
        ? (updated[0]?.id ?? null)
        : state.activeAthleteId
      return { athletes: updated, activeAthleteId: newActive }
    })
  },

  setActiveAthlete: (id) => set({ activeAthleteId: id }),

  fetchAll: async () => {
    try {
      const res = await fetch('/api/athlete')
      const athletes: Athlete[] = await res.json()
      set({
        athletes,
        activeAthleteId: athletes[0]?.id ?? null,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },
}))
