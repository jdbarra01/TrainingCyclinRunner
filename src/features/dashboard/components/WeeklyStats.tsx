'use client'

import { useDashboard } from '../hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatMinutes, formatTss } from '@/lib/utils'

export function WeeklyStats() {
  const { weekWorkouts, weeklyTss, athleteLoading } = useDashboard()

  if (athleteLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Estadísticas Semanales</CardTitle></CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas Semanales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTss(weeklyTss)}</p>
            <p className="text-xs text-zinc-500">TSS Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatMinutes(weekWorkouts.reduce((sum, w) => sum + w.duration, 0))}
            </p>
            <p className="text-xs text-zinc-500">Duración</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{weekWorkouts.length}</p>
            <p className="text-xs text-zinc-500">Entrenos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
