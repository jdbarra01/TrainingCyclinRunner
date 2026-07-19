'use client'

import { calculatePowerZones } from '../services'
import type { Athlete } from '@/types'

interface CyclistSummaryProps {
  athlete: Athlete
}

export function CyclistSummary({ athlete }: CyclistSummaryProps) {
  const powerZones = calculatePowerZones(athlete.ftp)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500">FTP</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{athlete.ftp} W</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">W/kg</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {(athlete.ftp / athlete.weight).toFixed(1)}
          </p>
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
          Ver zonas de potencia
        </summary>
        <div className="mt-2 space-y-1">
          {Object.entries(powerZones).map(([key, zone]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{zone.name}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{zone.min}-{zone.max} W</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
