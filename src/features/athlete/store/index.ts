import { create } from 'zustand'
import type { Athlete, WeekDay } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'

const ALL_DAYS: WeekDay[] = [1, 2, 3, 4, 5, 6, 0]

interface AthleteState {
  athletes: Athlete[]
  activeAthleteId: string | null
  isLoading: boolean
  addAthlete: (data: Omit<Athlete, 'id'>) => Athlete
  updateAthlete: (id: string, data: Partial<Omit<Athlete, 'id'>>) => void
  removeAthlete: (id: string) => void
  setActiveAthlete: (id: string) => void
  loadFromStorage: () => void
}

function persistAthletes(athletes: Athlete[], activeId: string | null) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ATHLETE, JSON.stringify(athletes))
  localStorage.setItem(`${STORAGE_KEYS.ATHLETE}-active`, activeId ?? '')
}

function ensureAthleteFields(a: Athlete): Athlete {
  const updated = { ...a }
  if (!updated.trainingDays || updated.trainingDays.length === 0) {
    updated.trainingDays = [...ALL_DAYS]
  }
  if (!updated.sport) {
    updated.sport = 'cycling'
    updated.vo2max = 45
    updated.thresholdPace = 300
  }
  return updated
}

function migrateStoredAthlete(stored: unknown): Athlete[] {
  if (Array.isArray(stored)) return (stored as Athlete[]).map(ensureAthleteFields)
  if (stored && typeof stored === 'object' && 'id' in (stored as Record<string, unknown>)) {
    return [ensureAthleteFields(stored as Athlete)]
  }
  return []
}

export const useAthleteStore = create<AthleteState>((set, get) => ({
  athletes: [],
  activeAthleteId: null,
  isLoading: true,

  addAthlete: (data) => {
    const athlete = { id: generateId(), ...data }
    set((state) => {
      const updated = [...state.athletes, athlete]
      persistAthletes(updated, athlete.id)
      return { athletes: updated, activeAthleteId: athlete.id }
    })
    return athlete
  },

  updateAthlete: (id, data) => {
    set((state) => {
      const updated = state.athletes.map((a) =>
        a.id === id ? { ...a, ...data } : a
      )
      persistAthletes(updated, state.activeAthleteId)
      return { athletes: updated }
    })
  },

  removeAthlete: (id) => {
    set((state) => {
      const updated = state.athletes.filter((a) => a.id !== id)
      const newActive = state.activeAthleteId === id
        ? (updated[0]?.id ?? null)
        : state.activeAthleteId
      persistAthletes(updated, newActive)
      return { athletes: updated, activeAthleteId: newActive }
    })
  },

  setActiveAthlete: (id) => {
    persistAthletes(get().athletes, id)
    set({ activeAthleteId: id })
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.ATHLETE)
        const activeId = localStorage.getItem(`${STORAGE_KEYS.ATHLETE}-active`)
        const parsed = stored ? JSON.parse(stored) : []
        const athletes: Athlete[] = migrateStoredAthlete(parsed)
        const activeAthleteId = activeId && athletes.some(a => a.id === activeId)
          ? activeId
          : (athletes[0]?.id ?? null)
        set({ athletes, activeAthleteId, isLoading: false })
        return
      } catch {
        // ignore
      }
    }
    set({ isLoading: false })
  },
}))
