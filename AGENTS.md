<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions

## Architecture

- **Next.js 16 App Router** with API routes at `src/app/api/*/route.ts`
- **Prisma v7** with `prisma.config.ts` (not `schema.prisma` for config; schema at `prisma/schema.prisma`)
- **PostgreSQL 17** via Docker; DATABASE_URL env var required (dummy value used during build stage)
- **Zustand v5** stores fetch from API routes; no localStorage persistence
- **Feature-based** structure under `src/features/`

## Prisma v7 specifics

- Config goes in `prisma.config.ts`, not `schema.prisma`
- Client generated to `src/lib/db/generated/` via `output = "../src/lib/db/generated"` in schema
- Always use `@prisma/adapter-pg` for PostgreSQL adapter
- Build requires `DATABASE_URL` even if dummy (e.g. `DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy`)

## API routes

- POST returns created entity as JSON
- PUT expects `{ id, ...fields }`
- DELETE uses query param (`?id=`)
- All routes parse request body with `req.json()`

## Docker

- `docker-compose.yml` defines `db` (postgres:17) and `app` services
- `Dockerfile` multi-stage build; `prisma generate` runs in builder stage
- Database URL for app at runtime: `postgresql://training:training@db:5432/training`
- Migrations run at container start via `npx prisma migrate deploy`

## Stores

- Stores are Zustand with async actions (fetch/POST/PUT/DELETE)
- `fetchAll()` called in `useEffect` on mount
- Response validation: check `res.ok` and `Array.isArray` before setting state
- Optimistic updates only for basic CRUD (no rollback yet)

## Types

- Centralized at `src/types/index.ts`
- `TrainingPhase` and `WeekPlan` not exported (internal to types file)
- Labels, emojis, variants centralized in `src/lib/constants.ts`
