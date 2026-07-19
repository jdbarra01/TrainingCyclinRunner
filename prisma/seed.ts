import { PrismaClient } from '../src/lib/db/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { readFileSync, existsSync } from 'fs'

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const SEED_DIR = process.env.SEED_DIR || 'prisma/seed-data'

  function loadJSON(filename: string) {
    const path = `${SEED_DIR}/${filename}`
    if (!existsSync(path)) return []
    return JSON.parse(readFileSync(path, 'utf-8'))
  }

  const athletes = loadJSON('athletes.json')
  for (const a of athletes) {
    await prisma.athlete.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        name: a.name,
        sport: a.sport ?? 'cycling',
        ftp: a.ftp ?? 200,
        vo2max: a.vo2max ?? 45,
        thresholdPace: a.thresholdPace ?? 300,
        weight: a.weight,
        height: a.height,
        age: a.age,
        hrMax: a.hrMax,
        hrRest: a.hrRest,
        gender: a.gender ?? 'male',
        experience: a.experience ?? 'intermediate',
        trainingDays: a.trainingDays ?? [1, 2, 3, 4, 5, 6, 0],
      },
    })
  }
  console.log(`Seeded ${athletes.length} athletes`)

  const objectives = loadJSON('objectives.json')
  for (const o of objectives) {
    await prisma.trainingObjective.upsert({
      where: { id: o.id },
      update: {},
      create: {
        id: o.id,
        athleteId: o.athleteId,
        name: o.name,
        description: o.description ?? '',
        type: o.type,
        phase: o.phase ?? 'base',
        startDate: new Date(o.startDate),
        endDate: new Date(o.endDate),
        targetEvent: o.targetEvent,
        notes: o.notes,
        weeklyFrequency: o.weeklyFrequency ?? 1,
        priority: o.priority ?? 'medium',
      },
    })
  }
  console.log(`Seeded ${objectives.length} objectives`)

  const plans = loadJSON('plans.json')
  for (const p of plans) {
    await prisma.trainingPlan.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        athleteId: p.athleteId,
        objectiveIds: p.objectiveIds ?? [],
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
        phase: p.phase ?? 'base',
        weeks: p.weeks ?? [],
      },
    })
  }
  console.log(`Seeded ${plans.length} plans`)

  const workouts = loadJSON('workouts.json')
  for (const w of workouts) {
    await prisma.workout.upsert({
      where: { id: w.id },
      update: {},
      create: {
        id: w.id,
        name: w.name,
        description: w.description ?? '',
        type: w.type,
        duration: w.duration,
        tss: w.tss ?? 0,
        normalizedPower: w.normalizedPower ?? 0,
        intensityFactor: w.intensityFactor ?? 0,
        intervals: w.intervals ?? [],
        warmup: w.warmup ?? 10,
        cooldown: w.cooldown ?? 10,
        scheduledDate: w.scheduledDate ? new Date(w.scheduledDate) : null,
        objectiveId: w.objectiveId,
        planId: w.planId,
      },
    })
  }
  console.log(`Seeded ${workouts.length} workouts`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
