const spec = {
  openapi: '3.0.3',
  info: {
    title: 'TrainingCyclingRunner API',
    description: 'API REST para gestionar atletas, objetivos, planes de entrenamiento y workouts. Base de datos PostgreSQL con Prisma ORM.',
    version: '1.0.0',
  },
  servers: [{ url: '/api', description: 'API base' }],
  paths: {
    '/api/athlete': {
      get: {
        tags: ['Atletas'],
        summary: 'Listar todos los atletas',
        responses: {
          '200': {
            description: 'Array de atletas',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Athlete' } } } },
          },
          '500': { description: 'Error interno' },
        },
      },
      post: {
        tags: ['Atletas'],
        summary: 'Crear un atleta',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AthleteInput' } } },
        },
        responses: {
          '201': { description: 'Atleta creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Athlete' } } } },
          '500': { description: 'Error interno' },
        },
      },
      put: {
        tags: ['Atletas'],
        summary: 'Actualizar un atleta',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } } } } },
        },
        responses: {
          '200': { description: 'Atleta actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Athlete' } } } },
          '500': { description: 'Error interno' },
        },
      },
      delete: {
        tags: ['Atletas'],
        summary: 'Eliminar un atleta',
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Atleta eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' } } } } } },
          '400': { description: 'id requerido' },
          '500': { description: 'Error interno' },
        },
      },
    },
    '/api/objectives': {
      get: {
        tags: ['Objetivos'],
        summary: 'Listar objetivos',
        parameters: [{ name: 'athleteId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por atleta' }],
        responses: {
          '200': { description: 'Array de objetivos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TrainingObjective' } } } } },
          '500': { description: 'Error interno' },
        },
      },
      post: {
        tags: ['Objetivos'],
        summary: 'Crear un objetivo',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingObjectiveInput' } } } },
        responses: {
          '201': { description: 'Objetivo creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingObjective' } } } },
          '500': { description: 'Error interno' },
        },
      },
      put: {
        tags: ['Objetivos'],
        summary: 'Actualizar un objetivo',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } } } } } },
        responses: {
          '200': { description: 'Objetivo actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingObjective' } } } },
          '500': { description: 'Error interno' },
        },
      },
      delete: {
        tags: ['Objetivos'],
        summary: 'Eliminar un objetivo',
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Objetivo eliminado' },
          '400': { description: 'id requerido' },
          '500': { description: 'Error interno' },
        },
      },
    },
    '/api/training': {
      get: {
        tags: ['Planes'],
        summary: 'Listar planes de entrenamiento',
        parameters: [{ name: 'athleteId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por atleta' }],
        responses: {
          '200': { description: 'Array de planes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TrainingPlan' } } } } },
          '500': { description: 'Error interno' },
        },
      },
      post: {
        tags: ['Planes'],
        summary: 'Crear un plan',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingPlanInput' } } } },
        responses: {
          '201': { description: 'Plan creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingPlan' } } } },
          '500': { description: 'Error interno' },
        },
      },
      put: {
        tags: ['Planes'],
        summary: 'Actualizar un plan',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } } } } } },
        responses: {
          '200': { description: 'Plan actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainingPlan' } } } },
          '500': { description: 'Error interno' },
        },
      },
      delete: {
        tags: ['Planes'],
        summary: 'Eliminar un plan',
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Plan eliminado' },
          '400': { description: 'id requerido' },
          '500': { description: 'Error interno' },
        },
      },
    },
    '/api/workouts': {
      get: {
        tags: ['Workouts'],
        summary: 'Listar todos los workouts',
        responses: {
          '200': { description: 'Array de workouts', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Workout' } } } } },
          '500': { description: 'Error interno' },
        },
      },
      post: {
        tags: ['Workouts'],
        summary: 'Crear un workout',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkoutInput' } } } },
        responses: {
          '201': { description: 'Workout creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Workout' } } } },
          '500': { description: 'Error interno' },
        },
      },
      put: {
        tags: ['Workouts'],
        summary: 'Actualizar un workout',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } } } } } },
        responses: {
          '200': { description: 'Workout actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Workout' } } } },
          '500': { description: 'Error interno' },
        },
      },
      delete: {
        tags: ['Workouts'],
        summary: 'Eliminar un workout',
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Workout eliminado' },
          '400': { description: 'id requerido' },
          '500': { description: 'Error interno' },
        },
      },
    },
  },
  components: {
    schemas: {
      Athlete: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          sport: { type: 'string', enum: ['cycling', 'running'] },
          ftp: { type: 'integer', description: 'FTP en vatios' },
          vo2max: { type: 'integer' },
          thresholdPace: { type: 'integer', description: 'Umbral de ritmo en seg/km' },
          weight: { type: 'number' },
          height: { type: 'integer' },
          age: { type: 'integer' },
          hrMax: { type: 'integer' },
          hrRest: { type: 'integer' },
          gender: { type: 'string', enum: ['male', 'female', 'other'] },
          experience: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'pro'] },
          trainingDays: { type: 'array', items: { type: 'integer' } },
        },
      },
      AthleteInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          sport: { type: 'string', enum: ['cycling', 'running'] },
          ftp: { type: 'integer' },
          vo2max: { type: 'integer' },
          thresholdPace: { type: 'integer' },
          weight: { type: 'number' },
          height: { type: 'integer' },
          age: { type: 'integer' },
          hrMax: { type: 'integer' },
          hrRest: { type: 'integer' },
          gender: { type: 'string' },
          experience: { type: 'string' },
          trainingDays: { type: 'array', items: { type: 'integer' } },
        },
        required: ['name'],
      },
      TrainingObjective: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          athleteId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['endurance', 'tempo', 'threshold', 'vo2max', 'anaerobic', 'sprint', 'recovery'] },
          phase: { type: 'string', enum: ['base', 'build', 'peak', 'race', 'transition'] },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          targetEvent: { type: 'string' },
          notes: { type: 'string' },
          weeklyFrequency: { type: 'integer' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
      },
      TrainingObjectiveInput: {
        type: 'object',
        properties: {
          athleteId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          phase: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          targetEvent: { type: 'string' },
          notes: { type: 'string' },
          weeklyFrequency: { type: 'integer' },
          priority: { type: 'string' },
        },
        required: ['athleteId', 'name', 'type', 'phase', 'startDate', 'endDate', 'weeklyFrequency'],
      },
      TrainingPlan: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          athleteId: { type: 'string' },
          objectiveIds: { type: 'array', items: { type: 'string' } },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          phase: { type: 'string' },
          weeks: { type: 'array', items: { $ref: '#/components/schemas/WeekPlan' } },
        },
      },
      TrainingPlanInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          athleteId: { type: 'string' },
          objectiveIds: { type: 'array', items: { type: 'string' } },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          phase: { type: 'string' },
          weeks: { type: 'array', items: { $ref: '#/components/schemas/WeekPlan' } },
        },
        required: ['name', 'athleteId', 'startDate', 'endDate'],
      },
      WeekPlan: {
        type: 'object',
        properties: {
          weekStart: { type: 'string', format: 'date' },
          workouts: { type: 'array', items: { $ref: '#/components/schemas/Workout' } },
          totalTss: { type: 'number' },
          plannedTss: { type: 'number' },
        },
      },
      Workout: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['endurance', 'tempo', 'threshold', 'vo2max', 'anaerobic', 'sprint', 'recovery'] },
          duration: { type: 'integer', description: 'Duración en minutos' },
          tss: { type: 'number' },
          normalizedPower: { type: 'integer' },
          intensityFactor: { type: 'number' },
          intervals: { type: 'array', items: { $ref: '#/components/schemas/Interval' } },
          warmup: { type: 'integer', description: 'Minutos de calentamiento' },
          cooldown: { type: 'integer' },
          scheduledDate: { type: 'string', format: 'date' },
          objectiveId: { type: 'string' },
        },
      },
      WorkoutInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          duration: { type: 'integer' },
          tss: { type: 'number' },
          normalizedPower: { type: 'integer' },
          intensityFactor: { type: 'number' },
          intervals: { type: 'array', items: { $ref: '#/components/schemas/Interval' } },
          warmup: { type: 'integer' },
          cooldown: { type: 'integer' },
          scheduledDate: { type: 'string', format: 'date' },
          objectiveId: { type: 'string' },
        },
        required: ['name', 'type', 'duration'],
      },
      Interval: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          duration: { type: 'integer', description: 'Duración en segundos' },
          powerTarget: { type: 'integer', description: 'Potencia objetivo en vatios' },
          paceTarget: { type: 'integer', description: 'Ritmo objetivo en seg/km' },
          cadence: { type: 'integer' },
          restAfter: { type: 'integer', description: 'Recuperación después en segundos' },
          order: { type: 'integer' },
        },
      },
    },
  },
} satisfies Record<string, unknown>

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(spec)
}
