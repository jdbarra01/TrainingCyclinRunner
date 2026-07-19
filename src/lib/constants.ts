import type { PowerZoneRange } from '@/types'

export const APP_NAME = 'TrainingCyclingRunner'
export const APP_TAGLINE = 'Entrena con inteligencia, rueda con potencia'

export const POWER_ZONES: PowerZoneRange[] = [
  { zone: 'activeRecovery', name: 'Recuperación Activa', minPercent: 0, maxPercent: 55, color: '#64748b' },
  { zone: 'endurance', name: 'Resistencia', minPercent: 56, maxPercent: 75, color: '#22c55e' },
  { zone: 'tempo', name: 'Tempo', minPercent: 76, maxPercent: 87, color: '#eab308' },
  { zone: 'threshold', name: 'Umbral', minPercent: 88, maxPercent: 105, color: '#f97316' },
  { zone: 'vo2max', name: 'VO2Máx', minPercent: 106, maxPercent: 120, color: '#ef4444' },
  { zone: 'anaerobic', name: 'Anaérobico', minPercent: 121, maxPercent: 150, color: '#dc2626' },
  { zone: 'neuromuscular', name: 'Neuromuscular', minPercent: 151, maxPercent: 200, color: '#8b5cf6' },
]

export const TRAINING_PHASES = [
  { value: 'base', label: 'Base', description: 'Construcción de resistencia aeróbica' },
  { value: 'build', label: 'Construcción', description: 'Desarrollo de potencia y velocidad' },
  { value: 'peak', label: 'Pico', description: 'Afinación para competencias' },
  { value: 'race', label: 'Competencia', description: 'Mantenimiento durante la temporada' },
  { value: 'transition', label: 'Transición', description: 'Descanso activo y recuperación' },
] as const

export const WORKOUT_TYPES = [
  { value: 'endurance', label: 'Resistencia', emoji: '🏔️' },
  { value: 'tempo', label: 'Tempo', emoji: '⚡' },
  { value: 'threshold', label: 'Umbral', emoji: '🔥' },
  { value: 'vo2max', label: 'VO2Máx', emoji: '💨' },
  { value: 'anaerobic', label: 'Anaérobico', emoji: '💥' },
  { value: 'sprint', label: 'Sprint', emoji: '🏁' },
  { value: 'recovery', label: 'Recuperación', emoji: '🧘' },
] as const

export const DIFFICULTY_COLORS: Record<string, string> = {
  endurance: 'bg-green-500',
  tempo: 'bg-yellow-500',
  threshold: 'bg-orange-500',
  vo2max: 'bg-red-500',
  anaerobic: 'bg-red-700',
  sprint: 'bg-purple-500',
  recovery: 'bg-blue-400',
}

export const STORAGE_KEYS = {
  ATHLETE: 'tc-athlete',
  OBJECTIVES: 'tc-objectives',
  TRAINING_PLANS: 'tc-training-plans',
  WORKOUTS: 'tc-workouts',
  WEEKLY_STATS: 'tc-weekly-stats',
} as const
