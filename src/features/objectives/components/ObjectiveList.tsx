'use client'

import { useObjectives } from '../hooks/useObjectives'
import { ObjectiveCard } from './ObjectiveCard'
import { EmptyState } from '@/components/ui/EmptyState'

export function ObjectiveList() {
  const { objectives, removeObjective } = useObjectives()

  if (objectives.length === 0) {
    return (
      <EmptyState
        title="No hay objetivos"
        description="Agrega tu primer objetivo de entrenamiento para empezar."
      />
    )
  }

  return (
    <div className="space-y-3">
      {objectives.map(objective => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          onDelete={removeObjective}
        />
      ))}
    </div>
  )
}
