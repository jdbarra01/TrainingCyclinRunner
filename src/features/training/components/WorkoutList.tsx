'use client'

import { useTraining } from '../hooks/useTraining'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { WorkoutCard } from './WorkoutCard'
import { EmptyState } from '@/components/ui/EmptyState'

export function WorkoutList() {
  const { workouts, removeWorkout } = useTraining()
  const { athlete } = useAthlete()
  const ftp = athlete?.ftp ?? 0

  if (workouts.length === 0) {
    return (
      <EmptyState
        title="No hay entrenos"
        description="Genera un plan de entrenamiento o crea workouts manualmente."
      />
    )
  }

  return (
    <div className="space-y-3">
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} onDelete={removeWorkout} ftp={ftp} />
      ))}
    </div>
  )
}
