export function calculatePaceZones(thresholdPace: number) {
  const tp = thresholdPace
  return {
    zona1: { min: Math.round(tp * 1.35), max: Math.round(tp * 1.55), name: 'Recuperación' },
    zona2: { min: Math.round(tp * 1.2), max: Math.round(tp * 1.34), name: 'Resistencia' },
    zona3: { min: Math.round(tp * 1.06), max: Math.round(tp * 1.19), name: 'Tempo' },
    zona4: { min: Math.round(tp * 0.97), max: Math.round(tp * 1.05), name: 'Umbral' },
    zona5: { min: Math.round(tp * 0.85), max: Math.round(tp * 0.96), name: 'VO2Máx' },
  }
}


