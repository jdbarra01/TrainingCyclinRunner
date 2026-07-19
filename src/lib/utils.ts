export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
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

export function formatPace(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, '0')} /km`
}

export function calculateTss(durationMinutes: number, normalizedPower: number, ftp: number): number {
  const np = Math.min(normalizedPower, ftp * 1.5)
  const if_ = np / ftp
  return Math.round((durationMinutes * np * if_) / (ftp * 36) * 100)
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
