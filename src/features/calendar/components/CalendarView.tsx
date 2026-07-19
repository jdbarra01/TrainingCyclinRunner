'use client'

import { useState } from 'react'
import { useCalendar, type CalendarWorkout } from '../hooks/useCalendar'
import { CalendarDay, CalendarWorkoutPopover } from './Calendar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'

export function CalendarView() {
  const { getMonthDays, getWorkoutsForDay, monthLabel, currentYear, currentMonth } = useCalendar()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [selectedWorkouts, setSelectedWorkouts] = useState<CalendarWorkout[] | null>(null)

  const days = getMonthDays(year, month)
  const today = new Date()

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const hasWorkouts = days.some(d => d !== null && getWorkoutsForDay(year, month, d).length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={prevMonth}>←</Button>
        <h2 className="text-xl font-bold capitalize text-zinc-900 dark:text-zinc-100">
          {monthLabel(year, month)}
        </h2>
        <Button variant="ghost" onClick={nextMonth}>→</Button>
      </div>

      {!hasWorkouts ? (
        <EmptyState
          title="Sin entrenos en este mes"
          description="Genera un plan de entrenamiento para ver los workouts en el calendario."
          action={
            <Link href="/training">
              <Button>Ir a Entrenos</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 py-1">
                {d}
              </div>
            ))}
            {days.map((day, i) => (
              <CalendarDay
                key={i}
                day={day}
                workouts={day !== null ? getWorkoutsForDay(year, month, day) : []}
                isToday={
                  day !== null &&
                  year === today.getFullYear() &&
                  month === today.getMonth() &&
                  day === today.getDate()
                }
                onClick={() => {
                  if (day !== null) {
                    const w = getWorkoutsForDay(year, month, day)
                    if (w.length > 0) setSelectedWorkouts(w)
                  }
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Resistencia</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-yellow-500" /> Tempo</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-orange-500" /> Umbral</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> VO2Máx</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-purple-500" /> Sprint</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-blue-400" /> Recup.</span>
          </div>
        </>
      )}

      {selectedWorkouts && (
        <CalendarWorkoutPopover
          workouts={selectedWorkouts}
          onClose={() => setSelectedWorkouts(null)}
        />
      )}
    </div>
  )
}
