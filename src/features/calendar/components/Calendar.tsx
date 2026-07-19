'use client'

import { useState } from 'react'
import type { CalendarWorkout } from '../hooks/useCalendar'
import { formatMinutes, formatTss } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useTraining } from '@/features/training/hooks/useTraining'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { WorkoutChart } from '@/features/training/components/WorkoutChart'

interface CalendarDayProps {
  day: number | null
  workouts: CalendarWorkout[]
  isToday: boolean
  onClick: () => void
}

const TYPE_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  endurance: 'success',
  tempo: 'warning',
  threshold: 'warning',
  vo2max: 'danger',
  anaerobic: 'danger',
  sprint: 'info',
  recovery: 'default',
}

const TYPE_LABELS: Record<string, string> = {
  endurance: 'Resistencia',
  tempo: 'Tempo',
  threshold: 'Umbral',
  vo2max: 'VO2Máx',
  anaerobic: 'Anaérobico',
  sprint: 'Sprint',
  recovery: 'Recuperación',
}

export function CalendarDay({ day, workouts, isToday, onClick }: CalendarDayProps) {
  if (day === null) return <div className="min-h-[80px] sm:min-h-[100px]" />

  const totalTss = workouts.reduce((s, w) => s + w.tss, 0)

  return (
    <button
      onClick={onClick}
      className={`relative flex min-h-[80px] sm:min-h-[100px] flex-col rounded-lg border p-1.5 text-left text-xs transition-all hover:border-blue-400 hover:shadow-sm sm:p-2 ${
        isToday
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
          : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'
      }`}
    >
      <span
        className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
          isToday
            ? 'bg-blue-600 text-white'
            : 'text-zinc-600 dark:text-zinc-400'
        }`}
      >
        {day}
      </span>
      {workouts.length > 0 && (
        <div className="flex-1 space-y-0.5 overflow-hidden">
          {workouts.slice(0, 3).map(w => (
            <Badge key={w.id} variant={TYPE_VARIANTS[w.type] ?? 'default'} className="truncate text-[10px] leading-tight">
              {TYPE_LABELS[w.type] ?? w.type}
            </Badge>
          ))}
          {workouts.length > 3 && (
            <span className="block text-[10px] text-zinc-400">+{workouts.length - 3} más</span>
          )}
          {totalTss > 0 && (
            <span className="mt-0.5 block text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(totalTss)} TSS
            </span>
          )}
        </div>
      )}
    </button>
  )
}

export function CalendarWorkoutPopover({
  workouts,
  onClose,
}: {
  workouts: CalendarWorkout[]
  onClose: () => void
}) {
  const { updateWorkoutInPlans } = useTraining()
  const [localWorkouts, setLocalWorkouts] = useState(workouts)

  const handleMove = (workoutId: string, newDate: string) => {
    updateWorkoutInPlans(workoutId, { scheduledDate: newDate })
    setLocalWorkouts(prev => prev.filter(w => w.id !== workoutId))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-zinc-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {localWorkouts.length} entrenos
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {localWorkouts.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-500">Todos los entrenos fueron movidos.</p>
          )}
          {localWorkouts.map(w => (
            <WorkoutDetailCard key={w.id} workout={w} onMove={handleMove} />
          ))}
        </div>

        <div className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkoutDetailCard({
  workout,
  onMove,
}: {
  workout: CalendarWorkout
  onMove: (id: string, newDate: string) => void
}) {
  const { athlete } = useAthlete()
  const ftp = athlete?.ftp ?? 0
  const [newDate, setNewDate] = useState(workout.date)
  const [moved, setMoved] = useState(false)
  if (moved) return null

  const handleReschedule = () => {
    if (newDate !== workout.date) {
      onMove(workout.id, newDate)
      setMoved(true)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-700/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{workout.name}</span>
            <Badge variant={TYPE_VARIANTS[workout.type] ?? 'default'}>
              {TYPE_LABELS[workout.type] ?? workout.type}
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {workout.description}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
        <div className="rounded-lg bg-white px-2 py-1.5 dark:bg-zinc-800">
          <span className="text-zinc-400">Duración</span>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatMinutes(workout.duration)}</p>
        </div>
        <div className="rounded-lg bg-white px-2 py-1.5 dark:bg-zinc-800">
          <span className="text-zinc-400">TSS</span>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatTss(workout.tss)}</p>
        </div>
        <div className="rounded-lg bg-white px-2 py-1.5 dark:bg-zinc-800">
          <span className="text-zinc-400">NP</span>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{workout.normalizedPower}W</p>
        </div>
        <div className="rounded-lg bg-white px-2 py-1.5 dark:bg-zinc-800">
          <span className="text-zinc-400">IF</span>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{workout.intensityFactor.toFixed(2)}</p>
        </div>
      </div>

      {ftp > 0 && (
        <div className="mt-3">
          <WorkoutChart workout={workout} ftp={ftp} athlete={athlete} compact />
        </div>
      )}

      {workout.intervals.length > 0 && (
        <details className="group mt-2">
          <summary className="flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            <svg className={`h-3 w-3 transition-transform group-open:rotate-90`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
            {workout.intervals.length} intervalos
          </summary>
          <div className="mt-1 space-y-0.5">
            {workout.intervals.map((interval, i) => (
              <div key={interval.id} className="flex items-center justify-between rounded bg-white/60 px-2 py-1 text-xs dark:bg-zinc-800/60">
                <span className="text-zinc-500">
                  #{i + 1} · {interval.duration >= 60 ? `${Math.round(interval.duration / 60)}min` : `${interval.duration}s`}
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{interval.powerTarget ? `${interval.powerTarget}W` : interval.paceTarget ? `${Math.floor(interval.paceTarget / 60)}:${String(interval.paceTarget % 60).padStart(2, '0')}` : '—'}</span>
                <span className="text-zinc-400">rec. {interval.restAfter >= 60 ? `${Math.round(interval.restAfter / 60)}min` : `${interval.restAfter}s`}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-600">
        <label className="text-xs text-zinc-500">Mover a:</label>
        <input
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReschedule}
          disabled={newDate === workout.date}
        >
          Mover
        </Button>
      </div>
    </div>
  )
}
