'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useObjectives } from '../hooks/useObjectives'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { OBJECTIVE_DEFAULTS, validateObjective, type ObjectiveFormData } from '../services'
import { generateId } from '@/lib/utils'

interface ObjectiveFormProps {
  onComplete?: () => void
}

export function ObjectiveForm({ onComplete }: ObjectiveFormProps) {
  const { addObjective } = useObjectives()
  const { athlete } = useAthlete()
  const [formData, setFormData] = useState<ObjectiveFormData>(OBJECTIVE_DEFAULTS)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!athlete) return
    const validationErrors = validateObjective(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    addObjective({
      id: generateId(),
      athleteId: athlete.id,
      ...formData,
    })
    setFormData(OBJECTIVE_DEFAULTS)
    onComplete?.()
  }

  const updateField = <K extends keyof ObjectiveFormData>(field: K, value: ObjectiveFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  if (!athlete) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-zinc-500">Configura un deportista primero para crear objetivos.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre del objetivo"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              error={errors.name}
              placeholder="Ej: Mejorar escalada"
            />
            <Select
              label="Tipo"
              helperText="Tipo de entrenamiento: Resistencia (aeróbico), Tempo (ritmo sostenido), Umbral (alta intensidad), VO2Máx (capacidad aeróbica), Anaérobico (lactato), Sprint (potencia máxima), Recuperación (descanso activo)"
              options={[
                { value: 'endurance', label: 'Resistencia' },
                { value: 'tempo', label: 'Tempo' },
                { value: 'threshold', label: 'Umbral' },
                { value: 'vo2max', label: 'VO2Máx' },
                { value: 'anaerobic', label: 'Anaérobico' },
                { value: 'sprint', label: 'Sprint' },
                { value: 'recovery', label: 'Recuperación' },
              ]}
              value={formData.type}
              onChange={e => updateField('type', e.target.value as ObjectiveFormData['type'])}
            />
            <Select
              label="Fase"
              helperText="Fase de entrenamiento: Base (volumen aeróbico), Construcción (intensidad), Pico (puesta a punto), Competencia (mantenimiento), Transición (descanso)"
              options={[
                { value: 'base', label: 'Base' },
                { value: 'build', label: 'Construcción' },
                { value: 'peak', label: 'Pico' },
                { value: 'race', label: 'Competencia' },
                { value: 'transition', label: 'Transición' },
              ]}
              value={formData.phase}
              onChange={e => updateField('phase', e.target.value as ObjectiveFormData['phase'])}
            />
            <Input
              label="Frecuencia semanal"
              type="number"
              min={1}
              max={14}
              value={formData.weeklyFrequency}
              onChange={e => updateField('weeklyFrequency', Number(e.target.value))}
              error={errors.weeklyFrequency}
            />
            <Select
              label="Prioridad"
              options={[
                { value: 'low', label: 'Baja' },
                { value: 'medium', label: 'Media' },
                { value: 'high', label: 'Alta' },
              ]}
              value={formData.priority}
              onChange={e => updateField('priority', e.target.value as ObjectiveFormData['priority'])}
            />
            <Input
              label="Evento objetivo (opcional)"
              value={formData.targetEvent ?? ''}
              onChange={e => updateField('targetEvent', e.target.value || undefined)}
              placeholder="Ej: Gran Fondo 2026"
            />
            <Input
              label="Fecha inicio"
              type="date"
              value={formData.startDate}
              onChange={e => updateField('startDate', e.target.value)}
              error={errors.startDate}
            />
            <Input
              label="Fecha fin"
              type="date"
              value={formData.endDate}
              onChange={e => updateField('endDate', e.target.value)}
              error={errors.endDate}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Descripción
            </label>
            <textarea
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              rows={3}
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Describe tu objetivo..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Agregar Objetivo</Button>
      </div>
    </form>
  )
}
