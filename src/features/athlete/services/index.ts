import type { Athlete, WeekDay } from '@/types'

export type AthleteFormData = Omit<Athlete, 'id'>

export const ALL_WEEK_DAYS: WeekDay[] = [1, 2, 3, 4, 5, 6, 0]

export const ATHLETE_DEFAULTS: AthleteFormData = {
  name: '',
  sport: 'running',
  ftp: 200,
  vo2max: 45,
  thresholdPace: 300,
  weight: 70,
  height: 175,
  age: 30,
  hrMax: 190,
  hrRest: 60,
  gender: 'male',
  experience: 'intermediate',
  trainingDays: [...ALL_WEEK_DAYS],
}

export function validateAthlete(data: AthleteFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.name.trim()) errors.name = 'El nombre es obligatorio'
  if (data.sport === 'cycling') {
    if (data.ftp < 50 || data.ftp > 600) errors.ftp = 'FTP debe estar entre 50 y 600'
  } else {
    if (data.vo2max < 20 || data.vo2max > 90) errors.vo2max = 'VO2máx debe estar entre 20 y 90 ml/kg/min'
    if (data.thresholdPace < 180 || data.thresholdPace > 600) errors.thresholdPace = 'Ritmo umbral debe estar entre 3:00 y 10:00 min/km'
  }
  if (data.weight < 30 || data.weight > 200) errors.weight = 'Peso debe estar entre 30 y 200 kg'
  if (data.height < 100 || data.height > 250) errors.height = 'Altura debe estar entre 100 y 250 cm'
  if (data.age < 16 || data.age > 100) errors.age = 'Edad debe estar entre 16 y 100'
  if (data.hrMax < 100 || data.hrMax > 250) errors.hrMax = 'FC Máx debe estar entre 100 y 250'
  if (data.hrRest < 30 || data.hrRest > 120) errors.hrRest = 'FC Reposo debe estar entre 30 y 120'
  return errors
}

export function calculateHeartRateZones(hrMax: number, hrRest: number) {
  const hrr = hrMax - hrRest
  return {
    zone1: { min: Math.round(hrRest + hrr * 0.5), max: Math.round(hrRest + hrr * 0.6), name: 'Recuperación' },
    zone2: { min: Math.round(hrRest + hrr * 0.6), max: Math.round(hrRest + hrr * 0.7), name: 'Resistencia' },
    zone3: { min: Math.round(hrRest + hrr * 0.7), max: Math.round(hrRest + hrr * 0.8), name: 'Tempo' },
    zone4: { min: Math.round(hrRest + hrr * 0.8), max: Math.round(hrRest + hrr * 0.9), name: 'Umbral' },
    zone5: { min: Math.round(hrRest + hrr * 0.9), max: hrMax, name: 'VO2Máx' },
  }
}

export { calculatePowerZones, estimateFtpFromVO2max } from './cycling'
export { calculatePaceZones, formatPace, estimateVO2maxFromPace } from './running'
