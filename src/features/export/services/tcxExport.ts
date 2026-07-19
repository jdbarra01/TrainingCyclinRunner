import type { Workout } from '@/types'

export function generateTcx(workout: Workout): string {
  const now = new Date().toISOString()
  const totalTime = (workout.duration + workout.warmup + workout.cooldown) * 60

  let tcx = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Courses>
    <Course>
      <Name>${escapeXml(workout.name)}</Name>
      <Lap>
        <TotalTimeSeconds>${totalTime}</TotalTimeSeconds>
        <DistanceMeters>0</DistanceMeters>
        <BeginPosition>
          <LatitudeDegrees>0</LatitudeDegrees>
          <LongitudeDegrees>0</LongitudeDegrees>
        </BeginPosition>
        <EndPosition>
          <LatitudeDegrees>0</LatitudeDegrees>
          <LongitudeDegrees>0</LongitudeDegrees>
        </EndPosition>
        <Intensity>Active</Intensity>
        <Notes>${escapeXml(workout.description)}</Notes>
      </Lap>`

  if (workout.warmup > 0) {
    tcx += `
      <Track>
        <Trackpoint>
          <Time>${now}</Time>
          <HeartRateBpm>
            <Value>0</Value>
          </HeartRateBpm>
          <Extensions>
            <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
              <Watts>${Math.round(workout.normalizedPower * 0.5)}</Watts>
            </TPX>
          </Extensions>
        </Trackpoint>
      </Track>
      <Notes>Warmup ${workout.warmup} min</Notes>`
  }

  for (const interval of workout.intervals) {
    tcx += `
      <Track>
        <Trackpoint>
          <Time>${now}</Time>
          <HeartRateBpm>
            <Value>0</Value>
          </HeartRateBpm>
          <Extensions>
            <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
              <Watts>${interval.powerTarget}</Watts>
            </TPX>
          </Extensions>
        </Trackpoint>
      </Track>
      <Notes>Interval ${interval.order + 1}: ${Math.round(interval.duration / 60)}min @ ${interval.powerTarget}W, rest ${Math.round(interval.restAfter / 60)}min</Notes>`
  }

  tcx += `
    </Course>
    <CourseName>${escapeXml(workout.name)}</CourseName>
    <Author xsi:type="Application_t">
      <Name>TrainingCyclingRunner</Name>
    </Author>
  </Courses>
</TrainingCenterDatabase>`

  return tcx
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
    lines.push(`  ${interval.order + 1}. ${durationStr} @ ${interval.powerTarget}W (desc: ${interval.restAfter >= 60 ? Math.round(interval.restAfter / 60) + 'min' : interval.restAfter + 's'})`)
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
