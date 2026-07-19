'use client'

import { Input } from '@/components/ui/Input'
import type { AthleteFormData } from '../services'

interface RunnerFormProps {
  formData: AthleteFormData
  errors: Record<string, string>
  updateField: <K extends keyof AthleteFormData>(field: K, value: AthleteFormData[K]) => void
}

export function RunnerForm({ formData, errors, updateField }: RunnerFormProps) {
  return (
    <>
      <Input
        label="VO₂máx (ml/kg/min)"
        type="number"
        value={formData.vo2max}
        onChange={e => updateField('vo2max', Number(e.target.value))}
        error={errors.vo2max}
        helperText="Consumo máximo de oxígeno"
      />
      <Input
        label="Ritmo umbral (seg/km)"
        type="number"
        value={formData.thresholdPace}
        onChange={e => updateField('thresholdPace', Number(e.target.value))}
        error={errors.thresholdPace}
        helperText={`Ej: 300 = ${Math.floor(300/60)}:${String(300%60).padStart(2,'0')} min/km`}
      />
    </>
  )
}
