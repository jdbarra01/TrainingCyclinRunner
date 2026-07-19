export function calculatePowerZones(ftp: number) {
  return {
    zona1: { min: 0, max: Math.round(ftp * 0.55), name: 'Recuperación Activa' },
    zona2: { min: Math.round(ftp * 0.56), max: Math.round(ftp * 0.75), name: 'Resistencia' },
    zona3: { min: Math.round(ftp * 0.76), max: Math.round(ftp * 0.87), name: 'Tempo' },
    zona4: { min: Math.round(ftp * 0.88), max: Math.round(ftp * 1.05), name: 'Umbral' },
    zona5: { min: Math.round(ftp * 1.06), max: Math.round(ftp * 1.2), name: 'VO₂Máx' },
    zona6: { min: Math.round(ftp * 1.21), max: Math.round(ftp * 1.5), name: 'Anaérobico' },
  }
}
