'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useTraining } from '../hooks/useTraining'
import type { WorkoutType } from '@/types'

const WORKOUT_OPTIONS = [
  { value: 'endurance', label: '🏔️ Resistencia' },
  { value: 'tempo', label: '⚡ Tempo' },
  { value: 'threshold', label: '🔥 Umbral' },
  { value: 'vo2max', label: '💨 VO2Máx' },
  { value: 'anaerobic', label: '💥 Anaérobico' },
  { value: 'sprint', label: '🏁 Sprint' },
  { value: 'recovery', label: '🧘 Recuperación' },
]

export function QuickWorkoutCreator() {
  const { createWorkout } = useTraining()
  const [type, setType] = useState<WorkoutType>('endurance')
  const [duration, setDuration] = useState(90)
  const [isCreated, setIsCreated] = useState(false)

  const handleCreate = () => {
    const workout = createWorkout(type, duration)
    if (workout) {
      setIsCreated(true)
      setTimeout(() => setIsCreated(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Entreno Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Select
              label="Tipo"
              options={WORKOUT_OPTIONS}
              value={type}
              onChange={e => setType(e.target.value as WorkoutType)}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Duración (min)
            </label>
            <input
              type="number"
              min={30}
              max={240}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <Button onClick={handleCreate} disabled={isCreated}>
            {isCreated ? '✓ Creado' : 'Crear'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
