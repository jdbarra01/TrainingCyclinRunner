import type { PowerZoneRange, WorkoutType, WeekDay } from '@/types'

export const APP_NAME = 'TrainingCyclingRunner'

export const POWER_ZONES: PowerZoneRange[] = [
  { zone: 'activeRecovery', name: 'Recuperación Activa', minPercent: 0, maxPercent: 55, color: '#64748b' },
  { zone: 'endurance', name: 'Resistencia', minPercent: 56, maxPercent: 75, color: '#22c55e' },
  { zone: 'tempo', name: 'Tempo', minPercent: 76, maxPercent: 87, color: '#eab308' },
  { zone: 'threshold', name: 'Umbral', minPercent: 88, maxPercent: 105, color: '#f97316' },
  { zone: 'vo2max', name: 'VO₂Máx', minPercent: 106, maxPercent: 120, color: '#ef4444' },
  { zone: 'anaerobic', name: 'Anaérobico', minPercent: 121, maxPercent: 150, color: '#dc2626' },
  { zone: 'neuromuscular', name: 'Neuromuscular', minPercent: 151, maxPercent: 200, color: '#8b5cf6' },
]

export const PACE_ZONES = [
  { zone: 'zone1', name: 'Recuperación', minPercent: 0, maxPercent: 65, color: '#64748b' },
  { zone: 'zone2', name: 'Resistencia', minPercent: 66, maxPercent: 80, color: '#22c55e' },
  { zone: 'zone3', name: 'Tempo', minPercent: 81, maxPercent: 87, color: '#eab308' },
  { zone: 'zone4', name: 'Umbral', minPercent: 88, maxPercent: 100, color: '#f97316' },
  { zone: 'zone5', name: 'VO₂Máx', minPercent: 101, maxPercent: 120, color: '#ef4444' },
] as const

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
  endurance: 'Resistencia',
  tempo: 'Tempo',
  threshold: 'Umbral',
  vo2max: 'VO₂Máx',
  anaerobic: 'Anaérobico',
  sprint: 'Sprint',
  recovery: 'Recuperación',
}

export const WORKOUT_EMOJIS: Record<WorkoutType, string> = {
  endurance: '🏔️',
  tempo: '⚡',
  threshold: '🔥',
  vo2max: '💨',
  anaerobic: '💥',
  sprint: '🏁',
  recovery: '🧘',
}

export const WORKOUT_VARIANTS: Record<WorkoutType, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  endurance: 'success',
  tempo: 'warning',
  threshold: 'warning',
  vo2max: 'danger',
  anaerobic: 'danger',
  sprint: 'info',
  recovery: 'default',
}

export const WORKOUT_BG: Record<WorkoutType, string> = {
  endurance: 'bg-green-50 dark:bg-green-950/20',
  tempo: 'bg-yellow-50 dark:bg-yellow-950/20',
  threshold: 'bg-orange-50 dark:bg-orange-950/20',
  vo2max: 'bg-red-50 dark:bg-red-950/20',
  anaerobic: 'bg-red-100 dark:bg-red-950/30',
  sprint: 'bg-purple-50 dark:bg-purple-950/20',
  recovery: 'bg-blue-50 dark:bg-blue-950/20',
}

export const PHASE_LABELS: Record<string, string> = {
  base: 'Base',
  build: 'Construcción',
  peak: 'Pico',
  race: 'Competencia',
  transition: 'Transición',
}

export const PRIORITY_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

export const DAY_ORDER: WeekDay[] = [1, 2, 3, 4, 5, 6, 0]

export const DAY_LABELS: Record<number, string> = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
}
