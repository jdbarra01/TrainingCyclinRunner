'use client'

import type { ExportFormat, Workout } from '@/types'
import { generateTcx, downloadFile } from '../services/tcxExport'
import { useCallback } from 'react'

export function useExport() {
  const exportWorkout = useCallback(
    (workout: Workout, format: ExportFormat) => {
      const safeName = workout.name.toLowerCase().replace(/\s+/g, '-')

      switch (format) {
        case 'tcx': {
          const tcx = generateTcx(workout)
          downloadFile(tcx, `${safeName}.tcx`, 'application/xml')
          break
        }
        case 'fit':
          downloadFile('', `${safeName}.fit`, 'application/octet-stream')
          break
        case 'gpx':
          downloadFile('', `${safeName}.gpx`, 'application/xml')
          break
      }
    },
    []
  )

  return { exportWorkout }
}
