'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAthlete } from '../hooks/useAthlete'
import { ATHLETE_DEFAULTS, validateAthlete, type AthleteFormData } from '../services'
import { CyclistForm } from './CyclistForm'
import { RunnerForm } from './RunnerForm'
import { generateId } from '@/lib/utils'
import { DAY_LABELS, DAY_ORDER } from '@/lib/constants'
import type { WeekDay } from '@/types'

export function AthleteForm() {
  const { athlete, athletes, setAthlete, addAthlete, removeAthlete } = useAthlete()
  const [formData, setFormData] = useState<AthleteFormData>(() =>
    athlete ? { ...ATHLETE_DEFAULTS, ...athlete } : ATHLETE_DEFAULTS
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateAthlete(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setAthlete({ id: athlete?.id ?? generateId(), ...formData })
  }

  const handleAddNew = () => {
    addAthlete(ATHLETE_DEFAULTS)
    setFormData(ATHLETE_DEFAULTS)
  }

  const handleDelete = () => {
    if (athlete && athletes.length > 1) {
      removeAthlete(athlete.id)
    }
  }

  const updateField = <K extends keyof AthleteFormData>(field: K, value: AthleteFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Datos del Deportista</CardTitle>
            {athletes.length > 1 && athlete && (
              <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              error={errors.name}
              placeholder="Ej: Juan Pérez"
            />
            <Select
              label="Deporte"
              options={[
                { value: 'running', label: '🏃 Running' },
                { value: 'cycling', label: '🚴 Ciclismo' },
              ]}
              value={formData.sport}
              onChange={e => updateField('sport', e.target.value as AthleteFormData['sport'])}
            />
            <Select
              label="Género"
              options={[{ value: 'male', label: 'Masculino' }, { value: 'female', label: 'Femenino' }, { value: 'other', label: 'Otro' }]}
              value={formData.gender}
              onChange={e => updateField('gender', e.target.value as AthleteFormData['gender'])}
            />
            <Input
              label="Edad"
              type="number"
              value={formData.age}
              onChange={e => updateField('age', Number(e.target.value))}
              error={errors.age}
            />
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={e => updateField('weight', Number(e.target.value))}
              error={errors.weight}
            />
            <Input
              label="Altura (cm)"
              type="number"
              value={formData.height}
              onChange={e => updateField('height', Number(e.target.value))}
              error={errors.height}
            />
            <Select
              label="Experiencia"
              options={[
                { value: 'beginner', label: 'Principiante' },
                { value: 'intermediate', label: 'Intermedio' },
                { value: 'advanced', label: 'Avanzado' },
                { value: 'pro', label: 'Profesional' },
              ]}
              value={formData.experience}
              onChange={e => updateField('experience', e.target.value as AthleteFormData['experience'])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {formData.sport === 'cycling' ? (
              <CyclistForm formData={formData} errors={errors} updateField={updateField} />
            ) : (
              <RunnerForm formData={formData} errors={errors} updateField={updateField} />
            )}
            <Input
              label="FC Máx (lpm)"
              type="number"
              value={formData.hrMax}
              onChange={e => updateField('hrMax', Number(e.target.value))}
              error={errors.hrMax}
            />
            <Input
              label="FC Reposo (lpm)"
              type="number"
              value={formData.hrRest}
              onChange={e => updateField('hrRest', Number(e.target.value))}
              error={errors.hrRest}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Días de Entreno</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            Selecciona los días de la semana que entrenas para generar la planificación.
          </p>
          <div className="flex flex-wrap gap-2">
            {DAY_ORDER.map(day => {
              const selected = formData.trainingDays.includes(day)
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? formData.trainingDays.filter(d => d !== day)
                      : [...formData.trainingDays, day]
                    if (next.length > 0) {
                      updateField('trainingDays', next)
                    }
                  }}
                  className={`flex h-12 w-14 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    selected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between gap-3">
        <Button type="button" variant="secondary" onClick={handleAddNew}>
          + Nuevo Deportista
        </Button>
        <Button type="submit" size="lg">
          {athlete ? 'Actualizar Perfil' : 'Guardar Perfil'}
        </Button>
      </div>
    </form>
  )
}
