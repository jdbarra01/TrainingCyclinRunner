'use client'

import { useTraining } from '@/features/training/hooks/useTraining'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { ExportButton } from '@/features/export/components/ExportButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatMinutes, formatTss } from '@/lib/utils'
import { formatPace } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function ExportView() {
  const { workouts, activePlan } = useTraining()
  const { athlete } = useAthlete()

  const allWorkouts = activePlan
    ? activePlan.weeks.flatMap(w => w.workouts)
    : workouts

  if (allWorkouts.length === 0) {
    return (
      <EmptyState
        title="Sin entrenos para exportar"
        description="Genera entrenamientos primero para poder exportarlos a tu dispositivo."
        action={
          <Link href="/training">
            <Button>Ir a Entrenos</Button>
          </Link>
        }
      />
    )
  }

  const isRunner = athlete?.sport === 'running'

  return (
    <div className="space-y-4">
      {activePlan && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Exportando desde: <strong>{activePlan.name}</strong> ({activePlan.weeks.length} semanas, {allWorkouts.length} entrenos)
            </p>
          </CardContent>
        </Card>
      )}

      {allWorkouts.map(workout => (
        <Card key={workout.id}>
          <CardHeader>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{isRunner ? '🏃' : '🚴'} {workout.name}</CardTitle>
                <Badge>{workout.type}</Badge>
              </div>
            </div>
            <ExportButton workout={workout} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>⏱️ {formatMinutes(workout.duration)}</span>
              <span>📊 {formatTss(workout.tss)}</span>
              {isRunner ? (
                <span>🏃 {formatPace(athlete?.thresholdPace ?? 300)} umbral</span>
              ) : (
                <span>⚡ {workout.normalizedPower}W NP</span>
              )}
              <span>📈 IF {workout.intensityFactor.toFixed(2)}</span>
              <span>🏋️ {workout.intervals.length} intervalos</span>
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{workout.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
