'use client'

import { useMemo, useCallback } from 'react'
import { useTraining } from '@/features/training/hooks/useTraining'
import type { Workout } from '@/types'

export interface CalendarWorkout extends Workout {
  date: string
}

export function useCalendar() {
  const { plans } = useTraining()

  const workoutsByDate = useMemo(() => {
    const map = new Map<string, CalendarWorkout[]>()
    for (const plan of plans) {
      for (const week of plan.weeks) {
        for (const w of week.workouts) {
          const date = w.scheduledDate
          if (!date) continue
          const existing = map.get(date) ?? []
          existing.push({
            ...w,
            date,
          })
          map.set(date, existing)
        }
      }
    }
    return map
  }, [plans])

  const getMonthDays = useCallback((year: number, month: number): (number | null)[] => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const days: (number | null)[] = []
    for (let i = 0; i < startPad; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
    return days
  }, [])

  const getDateKey = useCallback((year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }, [])

  const getWorkoutsForDay = useCallback((year: number, month: number, day: number): CalendarWorkout[] => {
    const key = getDateKey(year, month, day)
    return workoutsByDate.get(key) ?? []
  }, [workoutsByDate, getDateKey])

  const monthLabel = useCallback((year: number, month: number): string => {
    return new Date(year, month).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }, [])

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  return {
    workoutsByDate,
    getMonthDays,
    getDateKey,
    getWorkoutsForDay,
    monthLabel,
    currentYear,
    currentMonth,
  }
}
