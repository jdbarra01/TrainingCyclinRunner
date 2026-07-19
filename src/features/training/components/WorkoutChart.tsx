'use client'

import type { Workout, Athlete } from '@/types'
import { useMemo } from 'react'
import { POWER_ZONES } from '@/lib/constants'
import { formatMinutes } from '@/lib/utils'

interface WorkoutChartProps {
  workout: Workout
  ftp: number
  athlete?: Athlete | null
  compact?: boolean
}

interface ProfilePoint {
  time: number
  power: number
  label: string
}

const HR_ZONE_COLORS = [
  'bg-slate-400',
  'bg-green-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
]

function estimateHrZone(powerPercent: number): number {
  if (powerPercent <= 55) return 0
  if (powerPercent <= 75) return 1
  if (powerPercent <= 87) return 2
  if (powerPercent <= 105) return 3
  return 4
}

function estimateHrValue(powerPercent: number, hrMax: number, hrRest: number): number {
  const zone = estimateHrZone(powerPercent)
  const hrr = hrMax - hrRest
  const zoneRanges = [
    { min: 0.5, max: 0.6 },
    { min: 0.6, max: 0.7 },
    { min: 0.7, max: 0.8 },
    { min: 0.8, max: 0.9 },
    { min: 0.9, max: 1.0 },
  ]
  const range = zoneRanges[zone]
  const t = ((powerPercent - zone * 25) / 25)
  const fraction = range.min + (range.max - range.min) * Math.min(Math.max(t, 0), 1)
  return Math.round(hrRest + hrr * fraction)
}

export function WorkoutChart({ workout, ftp, athlete, compact = false }: WorkoutChartProps) {
  const hrMax = athlete?.hrMax ?? 190
  const hrRest = athlete?.hrRest ?? 60

  const profile = useMemo(() => {
    const points: ProfilePoint[] = []
    let currentTime = 0

    if (workout.warmup > 0) {
      points.push({ time: currentTime, power: Math.round(ftp * 0.4), label: 'Calentamiento' })
      currentTime += workout.warmup * 60
    }

    if (workout.intervals.length === 0) {
      if (workout.warmup === 0 && workout.cooldown === 0) {
        points.push({ time: 0, power: Math.round(ftp * 0.65), label: 'Constante' })
        currentTime = workout.duration * 60
      }
    } else {
      for (const interval of workout.intervals) {
        points.push({ time: currentTime, power: interval.powerTarget, label: `Int ${interval.order + 1}` })
        currentTime += interval.duration
        if (interval.restAfter > 0) {
          points.push({ time: currentTime, power: Math.round(ftp * 0.35), label: 'Descanso' })
          currentTime += interval.restAfter
        }
      }
    }

    if (workout.cooldown > 0) {
      points.push({ time: currentTime, power: Math.round(ftp * 0.35), label: 'Vuelta a la calma' })
    }

    return points
  }, [workout, ftp])

  const maxPower = Math.max(...profile.map(p => p.power), ftp * 1.1)
  const totalDuration = profile.length > 0 ? profile[profile.length - 1].time : workout.duration * 60
  const chartWidth = compact ? 500 : 700
  const chartHeight = compact ? 140 : 220
  const hrBarHeight = compact ? 16 : 24
  const totalHeight = chartHeight + hrBarHeight + 8
  const padding = { top: 10, right: 10, bottom: 18, left: 42 }
  const plotW = chartWidth - padding.left - padding.right
  const plotH = chartHeight - padding.top - padding.bottom

  const scaleX = (t: number) => padding.left + (t / totalDuration) * plotW
  const scaleY = (p: number) => padding.top + plotH - (p / (maxPower * 1.15)) * plotH

  const zoneBands = POWER_ZONES.map(zone => ({
    y: scaleY(ftp * (zone.maxPercent / 100)),
    h: scaleY(ftp * (zone.minPercent / 100)) - scaleY(ftp * (zone.maxPercent / 100)),
    color: zone.color,
    name: zone.name,
  }))

  const pathD = profile.map((p, i) => {
    const x = scaleX(p.time)
    const y = scaleY(p.power)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const areaD = `${pathD} L ${scaleX(totalDuration)} ${scaleY(0)} L ${scaleX(0)} ${scaleY(0)} Z`

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = Math.round((maxPower * 1.15 / 5) * (i + 1))
    const y = scaleY(val)
    return { y, val }
  })

  const hrBarSegments = useMemo(() => {
    if (profile.length < 2) return []
    const segments: { x: number; w: number; zone: number; hr: number }[] = []
    for (let i = 0; i < profile.length - 1; i++) {
      const p0 = profile[i]
      const p1 = profile[i + 1]
      const x0 = padding.left + (p0.time / totalDuration) * plotW
      const x1 = padding.left + (p1.time / totalDuration) * plotW
      const avgPower = (p0.power + p1.power) / 2
      const powerPercent = (avgPower / ftp) * 100
      const zone = estimateHrZone(powerPercent)
      const hr = estimateHrValue(powerPercent, hrMax, hrRest)
      segments.push({ x: x0, w: x1 - x0, zone, hr })
    }
    return segments
  }, [profile, ftp, hrMax, hrRest, totalDuration, plotW, padding.left])

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${totalHeight}`}
        className="w-full max-w-full"
        role="img"
        aria-label={`Perfil de potencia y frecuencia cardíaca del entrenamiento ${workout.name}`}
      >
        <rect x={padding.left} y={padding.top} width={plotW} height={plotH} fill="transparent" />

        {zoneBands.map((z, i) => (
          <rect
            key={i}
            x={padding.left}
            y={z.y}
            width={plotW}
            height={Math.max(z.h, 1)}
            fill={z.color}
            opacity={0.06}
          />
        ))}

        <line x1={padding.left} y1={scaleY(ftp)} x2={padding.left + plotW} y2={scaleY(ftp)} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />

        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padding.left} y1={t.y} x2={padding.left + plotW} y2={t.y} stroke="#e4e4e7" strokeWidth={0.5} />
            <text x={padding.left - 6} y={t.y + 3} textAnchor="end" className="fill-zinc-400 text-[10px]">{t.val}</text>
          </g>
        ))}

        {profile.length > 0 && (
          <>
            <path d={areaD} fill="url(#powerGradient)" opacity={0.15} />
            <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {profile.map((p, i) => (
              <circle key={i} cx={scaleX(p.time)} cy={scaleY(p.power)} r={compact ? 2.5 : 3.5} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
            ))}
          </>
        )}

        <defs>
          <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <text x={padding.left} y={chartHeight - 1} className="fill-zinc-400 text-[9px]">0</text>
        <text x={padding.left + plotW - 10} y={chartHeight - 1} className="fill-zinc-400 text-[9px]">{formatMinutes(Math.round(totalDuration / 60))}</text>
        <text x={padding.left + 4} y={padding.top - 3} className="fill-zinc-400 text-[9px]">Watts</text>

        <g transform={`translate(0, ${chartHeight + 4})`}>
          <rect x={padding.left} y={0} width={plotW} height={hrBarHeight} rx={hrBarHeight / 2} fill="#e4e4e7" />
          {hrBarSegments.map((s, i) => (
            <rect
              key={i}
              x={s.x}
              y={0}
              width={Math.max(s.w, 1)}
              height={hrBarHeight}
              fill={HR_ZONE_COLORS[s.zone]}
              opacity={0.7}
            />
          ))}
          {hrBarSegments.length > 0 && (
            <rect x={padding.left} y={0} width={plotW} height={hrBarHeight} rx={hrBarHeight / 2} fill="none" stroke="#d4d4d8" strokeWidth={0.5} />
          )}
          {Array.from({ length: 6 }, (_, i) => {
            const x = padding.left + (plotW / 5) * i
            return (
              <text key={i} x={x} y={hrBarHeight + 11} textAnchor={i === 0 ? 'start' : i === 5 ? 'end' : 'middle'} className="fill-zinc-400 text-[8px]">
                {formatMinutes(Math.round((totalDuration / 5) * i / 60))}
              </text>
            )
          })}
          <text x={padding.left + plotW / 2} y={hrBarHeight / 2 + 1} textAnchor="middle" className="fill-white text-[9px] font-medium">
            FC estimada
          </text>
        </g>
      </svg>

      <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 ${compact ? 'text-[10px]' : 'text-xs'} text-zinc-500`}>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" /> Potencia
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 border-b border-dashed border-blue-500" /> FTP ({ftp}W)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-green-500 to-red-500" /> FC estimada
        </span>
        {!compact && (
          <div className="flex flex-wrap gap-3">
            {POWER_ZONES.filter((_, i) => i % 2 === 1).map(z => (
              <span key={z.name} className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded" style={{ backgroundColor: z.color, opacity: 0.5 }} /> {z.name}
              </span>
            ))}
          </div>
        )}
        {compact && (
          <details className="inline-block">
            <summary className="cursor-pointer text-blue-600 dark:text-blue-400">Zonas</summary>
            <div className="mt-1 flex flex-wrap gap-2">
              {POWER_ZONES.map(z => (
                <span key={z.name} className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded" style={{ backgroundColor: z.color, opacity: 0.5 }} /> {z.name}
                </span>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
