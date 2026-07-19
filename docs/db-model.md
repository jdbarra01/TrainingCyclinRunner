# Modelo de Base de Datos

```mermaid
erDiagram
    Athlete ||--o{ TrainingObjective : "tiene"
    Athlete ||--o{ TrainingPlan : "tiene"

    Athlete {
        string id PK
        string name
        string sport "cycling | running"
        int ftp
        int vo2max
        int thresholdPace
        float weight
        int height
        int age
        int hrMax
        int hrRest
        string gender
        string experience
        json trainingDays "WeekDay[]"
        datetime createdAt
        datetime updatedAt
    }

    TrainingObjective {
        string id PK
        string athleteId FK
        string name
        string description
        string type "WorkoutType"
        string phase "TrainingPhase"
        datetime startDate
        datetime endDate
        string targetEvent "opcional"
        string notes "opcional"
        int weeklyFrequency
        string priority
        datetime createdAt
        datetime updatedAt
    }

    TrainingPlan {
        string id PK
        string athleteId FK
        string name
        json objectiveIds "string[]"
        datetime startDate
        datetime endDate
        string phase
        json weeks "WeekPlan[]"
        datetime createdAt
        datetime updatedAt
    }

    Workout {
        string id PK
        string name
        string description
        string type "WorkoutType"
        int duration
        float tss
        int normalizedPower
        float intensityFactor
        json intervals "Interval[]"
        int warmup
        int cooldown
        datetime scheduledDate "opcional"
        string objectiveId "opcional"
        string planId "opcional"
        datetime createdAt
        datetime updatedAt
    }
```

## Relaciones

```
Athlete ──1:N── TrainingObjective   (onDelete: Cascade)
Athlete ──1:N── TrainingPlan         (onDelete: Cascade)
```

## Estructuras anidadas (JSONB)

```
TrainingPlan.weeks ──> WeekPlan[]
  WeekPlan {
    weekStart: string
    workouts: Workout[]
    totalTss: number
    plannedTss: number
  }

Workout.intervals ──> Interval[]
  Interval {
    id: string
    duration: number
    powerTarget?: number
    paceTarget?: number
    cadence?: number
    restAfter: number
    order: number
  }
```

## Notas

- `Workout` es una tabla independiente para la lista plana de workouts.
- Dentro de `TrainingPlan.weeks`, los `Workout` se duplican como JSON anidado (no hay FK a la tabla Workout).
- `objectiveIds` y `trainingDays` se almacenan como JSONB.
- Todos los IDs usan `cuid()` (generado por Prisma).
