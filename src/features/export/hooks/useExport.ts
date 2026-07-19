'use client'

import type { ExportFormat, Workout, Sport } from '@/types'
import { generateTcx, downloadFile } from '../services/tcxExport'
import { useCallback } from 'react'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'

export function useExport() {
  const { athlete } = useAthlete()

  const exportWorkout = useCallback(
    (workout: Workout, format: ExportFormat) => {
      const safeName = workout.name.toLowerCase().replace(/\s+/g, '-')
      const sport = athlete?.sport ?? 'cycling'
      const thresholdPace = athlete?.thresholdPace ?? 300
      const content = generateTcx(workout, sport, thresholdPace)

      switch (format) {
        case 'tcx': {
          downloadFile(content, `${safeName}.tcx`, 'application/xml')
          break
        }
        case 'fit':
          downloadFile(content, `${safeName}.fit`, 'application/octet-stream')
          break
        case 'gpx':
          downloadFile(content, `${safeName}.gpx`, 'application/xml')
          break
      }
    },
    [athlete]
  )

  return { exportWorkout }
}
