'use client'

import { useDashboard } from '../hooks/useDashboard'
import { AthleteSummary } from '@/features/athlete/components/AthleteSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton'
import { formatMinutes, formatTss } from '@/lib/utils'
import Link from 'next/link'

export function DashboardOverview() {
  const { athlete, athleteLoading, activeObjectives, weekWorkouts, weekProgress, weeklyTss, upcomingWorkout, hasData } = useDashboard()

  const isRunner = athlete?.sport === 'running'

  if (!hasData && !athleteLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">🏋️ TrainingCyclingRunner</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Tu asistente de entrenamiento inteligente</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Link href="/athlete" className="group">
            <Card className="h-full text-center transition-all hover:border-blue-400">
              <CardContent>
                <div className="py-6">
                  <span className="text-4xl">👤</span>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Perfil</h3>
                  <p className="mt-1 text-sm text-zinc-500">Configura tus datos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/objectives" className="group">
            <Card className="h-full text-center transition-all hover:border-blue-400">
              <CardContent>
                <div className="py-6">
                  <span className="text-4xl">🎯</span>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Objetivos</h3>
                  <p className="mt-1 text-sm text-zinc-500">Define tus metas</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/training" className="group">
            <Card className="h-full text-center transition-all hover:border-blue-400">
              <CardContent>
                <div className="py-6">
                  <span className="text-4xl">📋</span>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. Entrena</h3>
                  <p className="mt-1 text-sm text-zinc-500">Genera tu plan</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500">Resumen de tu entrenamiento</p>
        </div>
        <Link href="/training">
          <Button>Ir a Entrenos</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {athleteLoading ? <CardSkeleton /> : <AthleteSummary />}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              {athleteLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTss(weeklyTss)}</p>
                    <p className="text-xs text-zinc-500">TSS Planificado</p>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Progreso</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{weekProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${weekProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-center text-sm text-zinc-500">
                    {weekWorkouts.length} entrenos esta semana
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objetivos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              {activeObjectives.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-zinc-500">Sin objetivos activos</p>
                  <Link href="/objectives">
                    <Button variant="ghost" size="sm" className="mt-2">Crear objetivo</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeObjectives.map(obj => (
                    <div key={obj.id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{obj.name}</span>
                      <Badge variant={obj.priority === 'high' ? 'danger' : obj.priority === 'medium' ? 'warning' : 'success'}>
                        {obj.weeklyFrequency}x/sem
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {upcomingWorkout && (
        <Card>
          <CardHeader>
            <CardTitle>Próximo Entreno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{upcomingWorkout.name}</p>
                <div className="flex gap-4 text-sm text-zinc-500">
                  <span>⏱️ {formatMinutes(upcomingWorkout.duration)}</span>
                  <span>📊 {formatTss(upcomingWorkout.tss)}</span>
                  {isRunner ? (
                    <span>💓 {upcomingWorkout.normalizedPower} bpm est.</span>
                  ) : (
                    <span>⚡ {upcomingWorkout.normalizedPower}W</span>
                  )}
                </div>
              </div>
              <Link href="/export">
                <Button variant="secondary" size="sm">Exportar a computador</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
