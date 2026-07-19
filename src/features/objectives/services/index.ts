import type { TrainingObjective } from '@/types'

export type ObjectiveFormData = Omit<TrainingObjective, 'id' | 'athleteId'>

export const OBJECTIVE_DEFAULTS: ObjectiveFormData = {
  name: '',
  description: '',
  type: 'endurance',
  phase: 'base',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  weeklyFrequency: 3,
  priority: 'medium',
}

export function validateObjective(data: ObjectiveFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.name.trim()) errors.name = 'El nombre es obligatorio'
  if (!data.description.trim()) errors.description = 'La descripción es obligatoria'
  if (!data.startDate) errors.startDate = 'La fecha de inicio es obligatoria'
  if (!data.endDate) errors.endDate = 'La fecha de fin es obligatoria'
  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    errors.endDate = 'La fecha de fin debe ser posterior a la de inicio'
  }
  if (data.weeklyFrequency < 1 || data.weeklyFrequency > 14) {
    errors.weeklyFrequency = 'Debe estar entre 1 y 14 sesiones semanales'
  }
  return errors
}
