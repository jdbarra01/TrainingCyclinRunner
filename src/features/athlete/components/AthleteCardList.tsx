'use client'

import { useAthlete } from '../hooks/useAthlete'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DAY_LABELS } from '@/lib/constants'
import Link from 'next/link'

const EXP_LABELS: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  pro: 'Pro',
}

export function AthleteCardList() {
  const { athletes, athlete: active, switchAthlete, isLoading } = useAthlete()

  if (isLoading) return null
  if (athletes.length === 0) return null

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Deportistas
        </h2>
        <Link href="/athlete">
          <Button variant="ghost" size="sm">+ Nuevo</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {athletes.map(a => {
          const isActive = a.id === active?.id
          const wkg = a.weight > 0 ? (a.ftp / a.weight).toFixed(1) : '—'
          return (
            <button
              key={a.id}
              onClick={() => switchAthlete(a.id)}
              className={`group relative rounded-xl border-2 p-4 text-left transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{a.sport === 'running' ? '🏃' : '🚴'} {a.name}</h3>
                  <p className="text-xs text-zinc-500">{EXP_LABELS[a.experience] ?? a.experience}</p>
                </div>
                {isActive && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                    ✓
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {a.sport === 'running' ? (
                  <>
                    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-700/50">
                      <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{a.vo2max}</span>
                      <span className="text-zinc-400">VO₂máx</span>
                    </div>
                    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-700/50">
                      <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{Math.floor(a.thresholdPace / 60)}:{String(a.thresholdPace % 60).padStart(2, '0')}</span>
                      <span className="text-zinc-400">Ritmo</span>
                    </div>
                    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-700/50">
                      <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{a.age}</span>
                      <span className="text-zinc-400">Edad</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-700/50">
                      <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{a.ftp}</span>
                      <span className="text-zinc-400">FTP</span>
                    </div>
                    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-700/50">
                      <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{wkg}</span>
                      <span className="text-zinc-400">W/kg</span>
                    </div>
                    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-700/50">
                      <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{a.age}</span>
                      <span className="text-zinc-400">Edad</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {a.trainingDays.sort().map(d => (
                  <span
                    key={d}
                    className="inline-flex h-5 w-7 items-center justify-center rounded text-[10px] font-medium text-zinc-500 dark:text-zinc-400"
                  >
                    {DAY_LABELS[d]}
                  </span>
                ))}
              </div>

              <div className="mt-2">
                <Badge variant="info" className="text-[10px]">{a.sport === 'running' ? `VO₂máx ${a.vo2max} · ${a.weight}kg` : `${a.ftp}W · ${a.weight}kg`}</Badge>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
