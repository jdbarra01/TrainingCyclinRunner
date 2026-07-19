'use client'

import type { Workout, ExportFormat } from '@/types'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { useExport } from '../hooks/useExport'

interface ExportButtonProps {
  workout: Workout
}

export function ExportButton({ workout }: ExportButtonProps) {
  const { exportWorkout } = useExport()
  const [format, setFormat] = useState<ExportFormat>('tcx')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      exportWorkout(workout, format)
    } catch {
      console.error('Export failed')
    }
    setTimeout(() => setExporting(false), 1000)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={format}
        onChange={e => setFormat(e.target.value as ExportFormat)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        aria-label="Formato de exportación"
      >
        <option value="tcx">📄 TCX (Garmin)</option>
        <option value="fit">📄 FIT</option>
        <option value="gpx">📄 GPX</option>
      </select>
      <Button onClick={handleExport} isLoading={exporting} size="md">
        📤 Exportar
      </Button>
    </div>
  )
}
