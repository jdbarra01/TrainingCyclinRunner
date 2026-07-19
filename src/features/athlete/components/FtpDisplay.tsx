'use client'

import { useAthlete } from '../hooks/useAthlete'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

export function FtpDisplay() {
  const { athlete, isLoading } = useAthlete()

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    )
  }

  if (!athlete) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-zinc-400">---</p>
        <p className="text-xs text-zinc-500">Sin FTP</p>
      </div>
    )
  }

  const wkg = (athlete.ftp / athlete.weight).toFixed(1)

  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{athlete.ftp}</p>
      <p className="text-xs text-zinc-500">FTP (W)</p>
      <Badge variant="info" className="mt-1">{wkg} W/kg</Badge>
    </div>
  )
}
