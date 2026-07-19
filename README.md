# TrainingCyclingRunner

Multi-sport training assistant for cyclists and runners. Manage athlete profiles, generate structured training plans, visualize workouts, and export to TCX.

---

## Overview

TrainingCyclingRunner is a training assistant built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **PostgreSQL** via **Prisma v7**. Manage athlete profiles for cycling and running, define training objectives, generate structured weekly plans, visualize workouts with sport-specific charts, and export to TCX (Garmin-compatible).

---

## Features

- Multi-athlete profiles (Cycling: FTP/W/kg/power zones; Running: VO₂max/threshold pace)
- Objective-based plan generator with weekly periodization
- Power-based intervals with TSS/NP/IF (cycling)
- Pace-based intervals with rTSS/normalized pace (running)
- SVG workout charts with zone bands and reference lines
- Interactive calendar with workout detail popover
- Dashboard with weekly TSS/rTSS progress
- TCX export for Garmin devices

---

## Architecture

See [docs/architecture.md](docs/architecture.md) and [docs/db-model.md](docs/db-model.md).

Key layers:
- **Next.js App Router** — server components by default, client components for interactivity
- **Zustand v5** — client-side state management, fetches from REST API
- **Prisma v7 + PostgreSQL** — data persistence via Docker
- **REST API routes** — `app/api/*` CRUD endpoints
- **Feature-based** — each feature is self-contained (components + hooks + services + store)

---

## Getting Started

### Prerequisites

- **Docker** + **Docker Compose** (recommended)
- Node.js ≥ 22 (for local development without Docker)

### Docker (recommended)

```bash
git clone https://github.com/jdbarra01/TrainingCyclinRunner.git
cd TrainingCyclinRunner

docker compose up -d
# → http://localhost:3000
```

### Local development

```bash
# Start PostgreSQL separately (e.g. via Docker):
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:17

# Install and run:
npm install
npx prisma migrate dev
npm run dev
# → http://localhost:3000
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| State | [Zustand v5](https://github.com/pmndrs/zustand) |
| Database | [PostgreSQL 17](https://www.postgresql.org) via [Prisma v7](https://www.prisma.io) |
| Charts | Pure SVG (no chart library) |
| Export | TCX XML (Garmin-compatible) |
| Container | [Docker Compose](https://docs.docker.com/compose/) |

---

## Roadmap

- [ ] User authentication and cloud sync
- [ ] FIT/GPX import (parse actual workout files)
- [ ] Advanced analytics (CTL, ATL, TSB, PMC chart)
- [ ] Dark mode toggle
- [ ] Multi-language support (ES/EN)
- [ ] PWA with offline support
- [ ] Mobile-optimized workout timer

---

## License

[MIT](LICENSE) © 2026 Jose Daniel Barra
