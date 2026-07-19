'use client'

import { useAthlete } from '../hooks/useAthlete'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { calculateHeartRateZones } from '../services'
import { CyclistSummary } from './CyclistSummary'
import { RunnerSummary } from './RunnerSummary'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

export function AthleteSummary() {
  const { athlete, athletes, isLoading, switchAthlete } = useAthlete()

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Deportista</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!athlete) {
    return (
      <Card>
        <CardHeader><CardTitle>Deportista</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-zinc-500">Aún no has configurado tu perfil de deportista.</p>
          <Link href="/athlete">
            <Button variant="primary">Configurar Perfil</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const isRunner = athlete.sport === 'running'
  const hrZones = calculateHeartRateZones(athlete.hrMax, athlete.hrRest)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <CardTitle>{athlete.name}</CardTitle>
            <Badge variant="info">
              {isRunner ? '🏃 Runner' : '🚴 Ciclista'} ·
              {athlete.experience === 'beginner' ? 'Principiante' : athlete.experience === 'intermediate' ? 'Intermedio' : athlete.experience === 'advanced' ? 'Avanzado' : 'Pro'}
            </Badge>
          </div>
          {athletes.length > 1 && (
            <div className="flex gap-1">
              {athletes.filter(a => a.id !== athlete.id).map(a => (
                <button
                  key={a.id}
                  onClick={() => switchAthlete(a.id)}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isRunner ? <RunnerSummary athlete={athlete} /> : <CyclistSummary athlete={athlete} />}

        <details className="mt-2">
          <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400">
            Ver zonas de frecuencia cardíaca
          </summary>
          <div className="mt-2 space-y-1">
            {Object.entries(hrZones).map(([key, zone]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">{zone.name}</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{zone.min}-{zone.max} lpm</span>
              </div>
            ))}
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
