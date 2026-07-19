'use client'

import type { TrainingObjective } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface ObjectiveCardProps {
  objective: TrainingObjective
  onDelete: (id: string) => void
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

const PHASE_LABELS: Record<string, string> = {
  base: 'Base',
  build: 'Construcción',
  peak: 'Pico',
  race: 'Competencia',
  transition: 'Transición',
}

const PRIORITY_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

export function ObjectiveCard({ objective, onDelete }: ObjectiveCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle>{objective.name}</CardTitle>
            <Badge variant={PRIORITY_VARIANTS[objective.priority]}>
              {objective.priority === 'low' ? 'Baja' : objective.priority === 'medium' ? 'Media' : 'Alta'}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(objective.id)}
          aria-label="Eliminar objetivo"
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{objective.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge>{TYPE_LABELS[objective.type] ?? objective.type}</Badge>
          <Badge variant="info">{PHASE_LABELS[objective.phase] ?? objective.phase}</Badge>
          <Badge variant="default">{objective.weeklyFrequency}x/semana</Badge>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
          <span>📅 {formatDate(objective.startDate)} → {formatDate(objective.endDate)}</span>
          {objective.targetEvent && <span>🎯 {objective.targetEvent}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
