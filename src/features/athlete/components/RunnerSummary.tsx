'use client'

import { calculatePaceZones } from '../services'
import { formatPace } from '@/lib/utils'
import type { Athlete } from '@/types'

interface RunnerSummaryProps {
  athlete: Athlete
}

export function RunnerSummary({ athlete }: RunnerSummaryProps) {
  const paceZones = calculatePaceZones(athlete.thresholdPace)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500">VO₂máx</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{athlete.vo2max} ml/kg/min</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Ritmo Umbral</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{formatPace(athlete.thresholdPace)}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Peso</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{athlete.weight} kg</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Edad</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{athlete.age} años</p>
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400">
          Ver zonas de ritmo
        </summary>
        <div className="mt-2 space-y-1">
          {Object.entries(paceZones).map(([key, zone]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{zone.name}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatPace(zone.min)} → {formatPace(zone.max)}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
