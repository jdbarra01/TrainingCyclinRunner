import type { Workout, Interval, WorkoutType, Athlete, TrainingObjective, WeekDay } from '@/types'
import { generateId, calculateTss, calculateIntensityFactor } from '@/lib/utils'

interface WorkoutConfig {
  type: WorkoutType
  duration: number
  ftp: number
  objectiveId?: string
}

interface DayAssignment {
  day: WeekDay
  type: WorkoutType
  duration: number
  label: string
}

const OBJECTIVE_PREFERRED_DAYS: Record<WorkoutType, WeekDay[]> = {
  endurance: [6, 3, 1, 5],
  tempo: [2, 4, 6],
  threshold: [2, 5, 4],
  vo2max: [3, 6, 1],
  anaerobic: [2, 5],
  sprint: [5, 0],
  recovery: [1, 4],
}

function generateIntervals(type: WorkoutType, duration: number, ftp: number): Interval[] {
  const warmupMinutes = 10
  const cooldownMinutes = 10
  const effectiveDuration = duration - warmupMinutes - cooldownMinutes

  if (effectiveDuration <= 0) return []

  switch (type) {
    case 'endurance': {
      const segmentMinutes = 20
      const count = Math.floor(effectiveDuration / segmentMinutes)
      return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        duration: segmentMinutes * 60,
        powerTarget: Math.round(ftp * 0.65),
        restAfter: 0,
        order: i,
      }))
    }
    case 'tempo': {
      const segmentMinutes = 15
      const count = Math.floor(effectiveDuration / segmentMinutes)
      return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        duration: segmentMinutes * 60,
        powerTarget: Math.round(ftp * 0.82),
        restAfter: 60,
        order: i,
      }))
    }
    case 'threshold': {
      const intervalMinutes = 8
      const count = Math.min(Math.floor(effectiveDuration / (intervalMinutes + 3)), 6)
      return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        duration: intervalMinutes * 60,
        powerTarget: Math.round(ftp * 0.95),
        restAfter: 180,
        order: i,
      }))
    }
    case 'vo2max': {
      const intervalMinutes = 3
      const count = Math.min(Math.floor(effectiveDuration / (intervalMinutes + 3)), 8)
      return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        duration: intervalMinutes * 60,
        powerTarget: Math.round(ftp * 1.10),
        restAfter: 180,
        order: i,
      }))
    }
    case 'anaerobic': {
      const intervalSeconds = 60
      const count = Math.min(Math.floor(effectiveDuration * 60 / (intervalSeconds + 120)), 12)
      return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        duration: intervalSeconds,
        powerTarget: Math.round(ftp * 1.35),
        restAfter: 120,
        order: i,
      }))
    }
    case 'sprint': {
      const sprintSeconds = 20
      const count = Math.min(Math.floor(effectiveDuration * 60 / (sprintSeconds + 300)), 8)
      return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        duration: sprintSeconds,
        powerTarget: Math.round(ftp * 1.5),
        restAfter: 300,
        order: i,
      }))
    }
    case 'recovery':
      return []
  }
}

function calculateWorkoutPowerProfile(intervals: Interval[], ftp: number): { np: number; if_: number; tss: number } {
  if (intervals.length === 0) {
    const np = Math.round(ftp * 0.6)
    return { np, if_: 0.6, tss: 0 }
  }

  const totalDuration = intervals.reduce((sum, i) => sum + i.duration + i.restAfter, 0)
  const weightedPowers = intervals.flatMap(i => Array(i.duration > 60 ? Math.floor(i.duration / 60) : 1).fill(i.powerTarget ?? Math.round(ftp * 0.65)))
  const restPower = Math.round(ftp * 0.4)
  const restDuration = Math.floor(totalDuration / 60) - weightedPowers.length
  const allPowers = [...weightedPowers, ...Array(Math.max(0, restDuration)).fill(restPower)]

  if (allPowers.length === 0) return { np: 0, if_: 0, tss: 0 }

  const fourth = allPowers.map(p => Math.pow(p, 4))
  const avgFourth = fourth.reduce((a, b) => a + b, 0) / fourth.length
  const np = Math.round(Math.pow(avgFourth, 0.25))
  const if_ = calculateIntensityFactor(np, ftp)
  const totalMinutes = Math.round(totalDuration / 60) + 20
  const tss = calculateTss(totalMinutes, np, ftp)

  return { np, if_, tss }
}

export function generateWorkout(config: WorkoutConfig): Workout {
  const { type, duration, ftp, objectiveId } = config
  const intervals = generateIntervals(type, duration, ftp)
  const { np, if_, tss } = calculateWorkoutPowerProfile(intervals, ftp)

  const typeLabels: Record<WorkoutType, string> = {
    endurance: 'Resistencia',
    tempo: 'Tempo',
    threshold: 'Umbral',
    vo2max: 'VO2Máx',
    anaerobic: 'Anaérobico',
    sprint: 'Sprint',
    recovery: 'Recuperación',
  }

  return {
    id: generateId(),
    name: `Entreno ${typeLabels[type]}`,
    description: generateDescription(type, np, ftp),
    type,
    duration,
    tss,
    normalizedPower: np,
    intensityFactor: if_,
    intervals,
    warmup: 10,
    cooldown: 10,
    objectiveId,
  }
}

function generateDescription(type: WorkoutType, np: number, ftp: number): string {
  const descriptions: Record<WorkoutType, string> = {
    endurance: `Mantén un esfuerzo constante en zona 2 (${Math.round(ftp * 0.56)}-${Math.round(ftp * 0.75)}W). Enfoque en eficiencia aeróbica y quema de grasas.`,
    tempo: `Ritmo sostenido en zona 3 (${Math.round(ftp * 0.76)}-${Math.round(ftp * 0.87)}W). Mejora la resistencia a alta intensidad.`,
    threshold: `Intervalos en zona 4 (${Math.round(ftp * 0.88)}-${Math.round(ftp * 1.05)}W). Aumenta el tiempo que puedes sostener potencia cerca del umbral.`,
    vo2max: `Intervalos explosivos en zona 5 (${Math.round(ftp * 1.06)}-${Math.round(ftp * 1.20)}W). Expande tu capacidad aeróbica máxima.`,
    anaerobic: `Esfuerzos máximos en zona 6 (${Math.round(ftp * 1.21)}-${Math.round(ftp * 1.50)}W). Desarrolla tolerancia al lactato y potencia anaeróbica.`,
    sprint: `Sprints máximos en zona 7 (>${Math.round(ftp * 1.51)}W). Activa fibras musculares rápidas y mejora la potencia máxima.`,
    recovery: `Ruedo suave en zona 1 (${Math.round(ftp * 0.55)}W). Promueve la recuperación activa con estrés mínimo.`,
  }
  return descriptions[type]
}

function assignDaysForObjective(
  objective: TrainingObjective,
  availableDays: WeekDay[]
): DayAssignment[] {
  const preferredDays = OBJECTIVE_PREFERRED_DAYS[objective.type]
  const freq = objective.weeklyFrequency

  const daysToUse: WeekDay[] = []
  for (const d of preferredDays) {
    if (availableDays.includes(d) && !daysToUse.includes(d)) {
      daysToUse.push(d)
    }
  }
  for (const d of availableDays) {
    if (daysToUse.length >= freq) break
    if (!daysToUse.includes(d)) daysToUse.push(d)
  }

  const actualFreq = Math.min(freq, daysToUse.length)
  const baseDuration = objective.type === 'recovery' ? 60 : objective.type === 'endurance' ? 120 : 90
  const longDuration = objective.type === 'endurance' ? 180 : baseDuration

  const configs: { duration: number; label: string }[] = []

  switch (objective.type) {
    case 'endurance': {
      configs.push({ duration: longDuration, label: 'Larga distancia' })
      configs.push({ duration: baseDuration, label: 'Media distancia' })
      configs.push({ duration: 75, label: 'Recovery activo' })
      configs.push({ duration: 90, label: 'Ritmo' })
      break
    }
    case 'tempo': {
      configs.push({ duration: baseDuration, label: 'Tempo' })
      configs.push({ duration: baseDuration, label: 'Tempo' })
      configs.push({ duration: 60, label: 'Tempo corto' })
      break
    }
    case 'threshold': {
      configs.push({ duration: baseDuration, label: 'Umbral' })
      configs.push({ duration: baseDuration, label: 'Umbral' })
      configs.push({ duration: 60, label: 'Umbral corto' })
      break
    }
    case 'vo2max': {
      configs.push({ duration: baseDuration, label: 'VO2Máx' })
      configs.push({ duration: 75, label: 'VO2Máx' })
      configs.push({ duration: 60, label: 'VO2 corto' })
      break
    }
    case 'anaerobic': {
      configs.push({ duration: baseDuration, label: 'Anaérobico' })
      configs.push({ duration: 60, label: 'Anaérobico' })
      break
    }
    case 'sprint': {
      configs.push({ duration: 60, label: 'Sprint' })
      configs.push({ duration: 45, label: 'Sprint' })
      break
    }
    case 'recovery': {
      configs.push({ duration: 45, label: 'Recuperación' })
      configs.push({ duration: 45, label: 'Recuperación' })
      break
    }
  }

  const sessions: DayAssignment[] = []
  for (let i = 0; i < actualFreq && i < configs.length; i++) {
    sessions.push({
      day: daysToUse[i],
      type: objective.type,
      duration: configs[i].duration,
      label: configs[i].label,
    })
  }

  sessions.sort((a, b) => a.day - b.day)
  return sessions
}

function mergeDayAssignments(
  objectives: TrainingObjective[],
  availableDays: WeekDay[]
): Map<WeekDay, DayAssignment[]> {
  const dayMap = new Map<WeekDay, DayAssignment[]>()
  for (const obj of objectives) {
    const assignments = assignDaysForObjective(obj, availableDays)
    for (const a of assignments) {
      const existing = dayMap.get(a.day) ?? []
      existing.push(a)
      dayMap.set(a.day, existing)
    }
  }
  return dayMap
}

export function generateTrainingPlan(
  objectives: TrainingObjective[],
  athlete: Athlete,
  weeks: number = 4
): { id: string; name: string; weeks: { weekStart: string; workouts: Workout[] }[] } {
  const availableDays: WeekDay[] = athlete.trainingDays?.length > 0
    ? [...athlete.trainingDays].sort((a, b) => a - b)
    : [1, 2, 3, 4, 5, 6, 0]

  const planStart = new Date()
  planStart.setHours(0, 0, 0, 0)
  const day = planStart.getDay()
  const diff = planStart.getDate() - day + (day === 0 ? -6 : 1)
  planStart.setDate(diff)

  const weekWorkouts: { weekStart: string; workouts: Workout[] }[] = []

  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(planStart)
    weekStart.setDate(weekStart.getDate() + w * 7)
    const workouts: Workout[] = []

    const dayAssignments = mergeDayAssignments(objectives, availableDays)

    for (const [weekDay, assignments] of dayAssignments) {
      const scheduledDate = new Date(weekStart)
      const dayOffset = (weekDay + 6) % 7
      scheduledDate.setDate(scheduledDate.getDate() + dayOffset)

      for (const assignment of assignments) {
        const workout = generateWorkout({
          type: assignment.type,
          duration: assignment.duration,
          ftp: athlete.ftp,
          objectiveId: objectives.find(o => o.type === assignment.type)?.id,
        })
        workout.name = `${assignment.label}`
        workout.scheduledDate = scheduledDate.toISOString().split('T')[0]
        workouts.push(workout)
      }
    }

    workouts.sort((a, b) => (a.scheduledDate ?? '').localeCompare(b.scheduledDate ?? ''))

    weekWorkouts.push({
      weekStart: weekStart.toISOString().split('T')[0],
      workouts,
    })
  }

  return {
    id: generateId(),
    name: `Plan ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
    weeks: weekWorkouts,
  }
}
