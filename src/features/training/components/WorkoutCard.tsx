'use client'

import type { Workout, Athlete } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatMinutes, formatTss } from '@/lib/utils'
import { WorkoutChart } from './WorkoutChart'

interface WorkoutCardProps {
  workout: Workout
  onDelete?: (id: string) => void
  athlete?: Athlete | null
  ftp?: number
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

const TYPE_EMOJIS: Record<string, string> = {
  endurance: '🏔️',
  tempo: '⚡',
  threshold: '🔥',
  vo2max: '💨',
  anaerobic: '💥',
  sprint: '🏁',
  recovery: '🧘',
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

const TYPE_BG: Record<string, string> = {
  endurance: 'bg-green-50 dark:bg-green-950/20',
  tempo: 'bg-yellow-50 dark:bg-yellow-950/20',
  threshold: 'bg-orange-50 dark:bg-orange-950/20',
  vo2max: 'bg-red-50 dark:bg-red-950/20',
  anaerobic: 'bg-red-100 dark:bg-red-950/30',
  sprint: 'bg-purple-50 dark:bg-purple-950/20',
  recovery: 'bg-blue-50 dark:bg-blue-950/20',
}

export function WorkoutCard({ workout, onDelete, athlete, ftp }: WorkoutCardProps) {
  const effectiveFtp = ftp ?? athlete?.ftp ?? 0

  return (
    <div className={`overflow-hidden rounded-xl border border-zinc-200 transition-all hover:shadow-sm dark:border-zinc-700 ${TYPE_BG[workout.type] ?? ''}`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{TYPE_EMOJIS[workout.type]}</span>
              <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {workout.name}
              </h3>
              <Badge variant={TYPE_VARIANTS[workout.type] ?? 'default'}>
                {TYPE_LABELS[workout.type] ?? workout.type}
              </Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {workout.description}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(workout.id)}
              className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200/50 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              aria-label="Eliminar"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg bg-white/70 px-3 py-2 text-center dark:bg-zinc-800/50">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{formatMinutes(workout.duration)}</p>
            <p className="text-[10px] text-zinc-400">Duración</p>
          </div>
          <div className="rounded-lg bg-white/70 px-3 py-2 text-center dark:bg-zinc-800/50">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatTss(workout.tss)}</p>
            <p className="text-[10px] text-zinc-400">TSS</p>
          </div>
          <div className="rounded-lg bg-white/70 px-3 py-2 text-center dark:bg-zinc-800/50">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{workout.normalizedPower}W</p>
            <p className="text-[10px] text-zinc-400">NP</p>
          </div>
          <div className="rounded-lg bg-white/70 px-3 py-2 text-center dark:bg-zinc-800/50">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">IF {workout.intensityFactor.toFixed(2)}</p>
            <p className="text-[10px] text-zinc-400">Intensidad</p>
          </div>
        </div>

        {effectiveFtp > 0 && (
          <div className="mt-4">
            <WorkoutChart workout={workout} ftp={effectiveFtp} athlete={athlete} compact />
          </div>
        )}

        {workout.intervals.length > 0 && (
          <details className="group mt-3">
            <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
              <svg className={`h-3.5 w-3.5 transition-transform group-open:rotate-90`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
              {workout.intervals.length} intervalos
            </summary>
            <div className="mt-2 space-y-1">
              <div className="grid grid-cols-3 gap-px rounded-lg bg-zinc-200 text-xs dark:bg-zinc-700">
                <div className="bg-zinc-50 px-3 py-1.5 text-center font-medium text-zinc-500 dark:bg-zinc-800">Intervalo</div>
                <div className="bg-zinc-50 px-3 py-1.5 text-center font-medium text-zinc-500 dark:bg-zinc-800">{athlete?.sport === 'running' ? 'Ritmo' : 'Potencia'}</div>
                <div className="bg-zinc-50 px-3 py-1.5 text-center font-medium text-zinc-500 dark:bg-zinc-800">Recuperación</div>
              </div>
              {workout.intervals.map((interval, i) => (
                <div key={interval.id} className="grid grid-cols-3 gap-px rounded-lg bg-zinc-200 text-xs dark:bg-zinc-700">
                  <div className="bg-white px-3 py-1.5 text-center text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    #{i + 1} · {interval.duration >= 60 ? `${Math.round(interval.duration / 60)}min` : `${interval.duration}s`}
                  </div>
                  <div className="bg-white px-3 py-1.5 text-center font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    {interval.powerTarget ? `${interval.powerTarget}W` : interval.paceTarget ? `${Math.floor(interval.paceTarget / 60)}:${String(interval.paceTarget % 60).padStart(2, '0')}` : '—'}
                  </div>
                  <div className="bg-white px-3 py-1.5 text-center text-zinc-500 dark:bg-zinc-800">
                    {interval.restAfter >= 60 ? `${Math.round(interval.restAfter / 60)}min` : `${interval.restAfter}s`}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
