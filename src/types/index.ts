export type WorkoutType = 'endurance' | 'tempo' | 'threshold' | 'vo2max' | 'anaerobic' | 'sprint' | 'recovery'

type TrainingPhase = 'base' | 'build' | 'peak' | 'race' | 'transition'

export type ExportFormat = 'fit' | 'tcx' | 'gpx'

export type Sport = 'cycling' | 'running'

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface Athlete {
  id: string
  name: string
  sport: Sport
  ftp: number
  vo2max: number
  thresholdPace: number
  weight: number
  height: number
  age: number
  hrMax: number
  hrRest: number
  gender: 'male' | 'female' | 'other'
  experience: 'beginner' | 'intermediate' | 'advanced' | 'pro'
  trainingDays: WeekDay[]
}

export interface PowerZoneRange {
  zone: string
  name: string
  minPercent: number
  maxPercent: number
  color: string
}

export interface TrainingObjective {
  id: string
  athleteId: string
  name: string
  description: string
  type: WorkoutType
  phase: TrainingPhase
  startDate: string
  endDate: string
  targetEvent?: string
  notes?: string
  weeklyFrequency: number
  priority: 'low' | 'medium' | 'high'
}

export interface Interval {
  id: string
  duration: number
  powerTarget?: number
  paceTarget?: number
  cadence?: number
  restAfter: number
  order: number
}

export interface Workout {
  id: string
  name: string
  description: string
  type: WorkoutType
  duration: number
  tss: number
  normalizedPower: number
  intensityFactor: number
  intervals: Interval[]
  warmup: number
  cooldown: number
  scheduledDate?: string
  objectiveId?: string
}

interface WeekPlan {
  weekStart: string
  workouts: Workout[]
  totalTss: number
  plannedTss: number
}

export interface TrainingPlan {
  id: string
  name: string
  athleteId: string
  objectiveIds: string[]
  startDate: string
  endDate: string
  phase: TrainingPhase
  weeks: WeekPlan[]
}
