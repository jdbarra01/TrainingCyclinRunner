export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function formatTss(tss: number): string {
  return `${Math.round(tss)} TSS`
}

export function calculateTss(durationMinutes: number, normalizedPower: number, ftp: number): number {
  const np = Math.min(normalizedPower, ftp * 1.5)
  const if_ = np / ftp
  return Math.round((durationMinutes * np * if_) / (ftp * 36) * 100)
}

export function calculateNormalizedPower(powers: number[]): number {
  if (powers.length === 0) return 0
  const fourth = powers.map(p => Math.pow(p, 4))
  const avg = fourth.reduce((a, b) => a + b, 0) / fourth.length
  return Math.round(Math.pow(avg, 0.25))
}

export function calculateIntensityFactor(np: number, ftp: number): number {
  if (ftp === 0) return 0
  return Math.round((np / ftp) * 100) / 100
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

export function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getMonday(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}
