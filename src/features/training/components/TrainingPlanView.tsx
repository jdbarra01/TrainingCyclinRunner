'use client'

import { useTraining } from '../hooks/useTraining'
import { useTrainingPlan } from '../hooks/useTraining'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatTss } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'
import { WorkoutCard } from './WorkoutCard'
import { WorkoutChart } from './WorkoutChart'

export function TrainingPlanView() {
  const { plans, activePlan, activePlanId, createPlan, setActivePlan, removePlan } = useTraining()
  const { canGeneratePlan } = useTrainingPlan()
  const { athlete } = useAthlete()
  const ftp = athlete?.ftp ?? 0

  const handleGeneratePlan = () => {
    createPlan(4)
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        title="Sin plan de entrenamiento"
        description="Genera un plan personalizado basado en tus objetivos y datos de deportista."
        action={
          canGeneratePlan ? (
            <Button onClick={handleGeneratePlan} size="lg">
              Generar Plan (4 semanas)
            </Button>
          ) : (
            <div className="space-y-2 text-center">
              <p className="text-sm text-zinc-500">Necesitas configurar:</p>
              <div className="flex justify-center gap-2">
                <Link href="/athlete">
                  <Button variant="secondary" size="sm">Perfil</Button>
                </Link>
                <Link href="/objectives">
                  <Button variant="secondary" size="sm">Objetivos</Button>
                </Link>
              </div>
            </div>
          )
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleGeneratePlan}>Generar Nuevo Plan</Button>
      </div>

      {plans.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activePlanId === plan.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>
      )}

      {activePlan && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{activePlan.name}</h3>
              <p className="text-sm text-zinc-500">
                {formatDate(activePlan.startDate)} → {formatDate(activePlan.endDate)} · {activePlan.weeks.length} semanas
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => removePlan(activePlan.id)}>
              Eliminar Plan
            </Button>
          </div>

          {activePlan.weeks.map((week, wi) => (
            <Card key={week.weekStart}>
              <CardHeader>
                <CardTitle>
                  Semana {wi + 1}: {formatDate(week.weekStart)}
                </CardTitle>
                <Badge variant="info">{formatTss(week.totalTss)}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {week.workouts.map(workout => (
                    <div key={workout.id}>
                      <WorkoutCard workout={workout} athlete={athlete} ftp={ftp} />
                      {ftp > 0 && (
                        <details className="group mt-2">
                          <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Ver gráfico de entrenamiento
                          </summary>
                          <div className="mt-2 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                            <WorkoutChart workout={workout} ftp={ftp} />
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
