# Arquitectura

```mermaid
flowchart TB
    subgraph Browser[Navegador]
        Next[Next.js Static Pages]
        Client[Client Components<br/>Zustand Stores]
    end

    subgraph Docker[Docker Compose]
        subgraph App[App Container<br/>node:22-alpine]
            API[API Routes]
            Prisma[Prisma ORM v7]
        end
        subgraph DB[DB Container<br/>postgres:17-alpine]
            PG[PostgreSQL]
        end
    end

    Next --> Client
    Client -->|HTTP| API
    API --> Prisma
    Prisma -->|TCP 5432| PG

    style Next fill:#e2e8f0,stroke:#475569
    style Client fill:#bfdbfe,stroke:#2563eb
    style API fill:#bbf7d0,stroke:#16a34a
    style Prisma fill:#fef3c7,stroke:#d97706
    style PG fill:#fecaca,stroke:#dc2626
```

## Flujo de datos

```
Usuario → Página estática (Server Component)
         → Componente Cliente
         → Hook (useAthlete / useObjectives / useTraining)
         → Zustand Store → fetch(/api/...)
         → Next.js API Route
         → Prisma ORM → PostgreSQL
         → JSON → Zustand Store → React re-renderiza
```

## Modelo de datos

```
Athlete 1──N TrainingObjective
Athlete 1──N TrainingPlan
TrainingPlan ── JSON ──> WeekPlan[]
WeekPlan ── JSON ──> Workout[]
Workout ── JSON ──> Interval[]
```

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 SSR + Tailwind CSS v4 |
| Estado UI | Zustand v5 |
| API | Next.js Route Handlers |
| ORM | Prisma v7 + @prisma/adapter-pg |
| DB | PostgreSQL 17 |
| Contenedor | Docker + Docker Compose |
| Despliegue | Render Web Service (Docker) |
