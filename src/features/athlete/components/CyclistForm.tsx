'use client'

import { Input } from '@/components/ui/Input'
import type { AthleteFormData } from '../services'

interface CyclistFormProps {
  formData: AthleteFormData
  errors: Record<string, string>
  updateField: <K extends keyof AthleteFormData>(field: K, value: AthleteFormData[K]) => void
}

export function CyclistForm({ formData, errors, updateField }: CyclistFormProps) {
  return (
    <Input
      label="FTP (watts)"
      type="number"
      value={formData.ftp}
      onChange={e => updateField('ftp', Number(e.target.value))}
      error={errors.ftp}
      helperText="Potencia Funcional Umbral"
    />
  )
}
