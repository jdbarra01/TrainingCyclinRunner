import type { Workout, Sport } from '@/types'
import { formatPace } from '@/lib/utils'

function generateTrackpoints(
  workout: Workout,
  sport: Sport,
  thresholdPace: number,
  startTime: Date
): string {
  let tracks = ''
  let currentTime = new Date(startTime)
  const totalMinutes = workout.duration

  for (let m = 0; m < totalMinutes; m++) {
    let power = 0
    let pace = 0
    let phase = ''

    if (m < workout.warmup) {
      power = Math.round((workout.normalizedPower || 150) * 0.5)
      pace = Math.round(thresholdPace * 1.4)
      phase = 'warmup'
    } else if (m >= totalMinutes - workout.cooldown) {
      power = Math.round((workout.normalizedPower || 150) * 0.4)
      pace = Math.round(thresholdPace * 1.5)
      phase = 'cooldown'
    } else {
      let accumulatedTime = workout.warmup
      let matched = false

      for (const interval of workout.intervals) {
        const intervalMin = Math.ceil(interval.duration / 60)
        const restMin = Math.ceil(interval.restAfter / 60)

        if (m >= accumulatedTime && m < accumulatedTime + intervalMin) {
          power = interval.powerTarget ?? 0
          pace = interval.paceTarget ?? thresholdPace
          matched = true
          break
        }
        accumulatedTime += intervalMin + restMin
      }

      if (!matched) {
        power = Math.round((workout.normalizedPower || 150) * 0.65)
        pace = Math.round(thresholdPace * 1.2)
      }
    }

    const timeStr = currentTime.toISOString()
    currentTime = new Date(currentTime.getTime() + 60000)

    tracks += `
      <Trackpoint>
        <Time>${timeStr}</Time>
        <Position>
          <LatitudeDegrees>0</LatitudeDegrees>
          <LongitudeDegrees>0</LongitudeDegrees>
        </Position>
        <HeartRateBpm>
          <Value>0</Value>
        </HeartRateBpm>
        <Extensions>
          <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
            <Watts>${power}</Watts>`

    if (sport === 'running' && pace > 0) {
      const speedMps = 1000 / pace
      tracks += `
            <Speed>${speedMps.toFixed(2)}</Speed>`
    }

    tracks += `
          </TPX>
        </Extensions>
      </Trackpoint>`
  }

  return tracks
}

export function generateTcx(
  workout: Workout,
  sport: Sport = 'cycling',
  thresholdPace: number = 300
): string {
  const now = new Date()
  const totalTime = workout.duration * 60
  const trackpoints = generateTrackpoints(workout, sport, thresholdPace, now)
  const speedMps = sport === 'running' ? (1000 / thresholdPace).toFixed(2) : '0'
  const distanceMeters = sport === 'running'
    ? Math.round((workout.duration * 60) / thresholdPace * 1000)
    : Math.round(workout.duration * 1.2 * 1000)

  const intervalNotes = workout.intervals.map((int, i) =>
    `${int.order + 1}. ${Math.ceil(int.duration / 60)}min × ${int.powerTarget ?? '—'}W / ${formatPace(int.paceTarget ?? thresholdPace)} (rest ${Math.ceil(int.restAfter / 60)}min)`
  ).join(' | ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Courses>
    <Course>
      <Name>${escapeXml(workout.name)}</Name>
      <Lap>
        <TotalTimeSeconds>${totalTime}</TotalTimeSeconds>
        <DistanceMeters>${distanceMeters}</DistanceMeters>
        <Intensity>Active</Intensity>
        <Notes>${escapeXml(workout.description)}${intervalNotes ? '\nIntervalos: ' + escapeXml(intervalNotes) : ''}</Notes>
      </Lap>
      <Track>${trackpoints}
      </Track>
    </Course>
    <CourseName>${escapeXml(workout.name)}</CourseName>
    <Author xsi:type="Application_t">
      <Name>TrainingCyclingRunner</Name>
    </Author>
  </Courses>
</TrainingCenterDatabase>`
}

export function generateFitDescription(workout: Workout): string {
  const lines: string[] = [
    `=== ${workout.name} ===`,
    workout.description,
    '',
    `Duración: ${workout.duration} min`,
    `TSS: ${workout.tss}`,
    `NP: ${workout.normalizedPower}W`,
    `IF: ${workout.intensityFactor.toFixed(2)}`,
    '',
    'Intervalos:',
  ]

  for (const interval of workout.intervals) {
    const durationStr = interval.duration >= 60
      ? `${Math.round(interval.duration / 60)} min`
      : `${interval.duration}s`
    const target = interval.powerTarget ? `${interval.powerTarget}W` : interval.paceTarget ? `${Math.floor(interval.paceTarget / 60)}:${String(interval.paceTarget % 60).padStart(2, '0')}/km` : '—'
    lines.push(`  ${interval.order + 1}. ${durationStr} @ ${target} (desc: ${interval.restAfter >= 60 ? Math.round(interval.restAfter / 60) + 'min' : interval.restAfter + 's'})`)
  }

  return lines.join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
