<div align="center">
  <br />
  <h1>🏋️ TrainingCyclingRunner</h1>
  <p><strong>Multi-sport training assistant for cyclists and runners</strong></p>
  <p>
    <a href="https://github.com/jdbarra01/TrainingCyclinRunner/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/jdbarra01/TrainingCyclinRunner/ci.yml?branch=main&label=build&logo=github" alt="Build">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/github/license/jdbarra01/TrainingCyclinRunner?color=blue" alt="License">
    </a>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js" alt="Next.js">
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS">
    </a>
  </p>
  <br />
</div>

> **Live demo**: [training-cycling-runner.onrender.com](https://training-cycling-runner.onrender.com) _(coming soon)_

---

## 📖 Overview

TrainingCyclingRunner is a single-page training assistant built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Zustand v5**. It lets you manage athlete profiles for cycling and running, define training objectives, generate structured weekly plans, visualize workouts with sport-specific charts, and export to TCX (Garmin-compatible).

All data is persisted in the browser via localStorage — no backend required. The architecture is prepared for a future REST API.

---

## ✨ Features

<div>
<table>
<thead>
<tr>
<th>Athlete Management</th>
<th>Training Plans</th>
<th>Analytics & Export</th>
</tr>
</thead>
<tbody>
<tr>
<td>

- 👥 Multi-athlete profiles
- 🚴 **Cyclist**: FTP, W/kg, power zones (7 zones)
- 🏃 **Runner**: VO₂max, threshold pace, pace zones (5 zones)
- ❤️ Heart rate zones (Karvonen method)
- 📅 Configurable training days per athlete
- ⚡ Instant athlete switching

</td>
<td>

- 🎯 Objective-based plan generator
- 📆 Weekly periodization (base → build → peak → race)
- ⚡ **Cycling**: Power-based intervals with TSS/NP/IF
- 🏃 **Running**: Pace-based intervals with rTSS/normalized pace
- 🔄 Configurable duration and intensity per session
- 📅 Interactive calendar with workout detail popover

</td>
<td>

- 📊 SVG workout charts with gradient profile
- 🔵 Power zone bands + FTP reference line
- 🟢 Pace zone bands + threshold pace reference
- 💓 Estimated heart rate bar (color-coded)
- 📈 Dashboard with weekly TSS/rTSS progress
- 📤 TCX export for Garmin devices

</td>
</tr>
</tbody>
</table>
</div>

### Screenshots

| Dashboard | Athlete Profile | Training Plan |
|---|---|---|
| ![Dashboard](public/screenshots/dashboard.png) | ![Profile](public/screenshots/perfil-runner.png) | ![Plan](public/screenshots/plan-entreno.png) |
| **Calendar** | **Workout Chart** | **Export** |
| ![Calendar](public/screenshots/calendario.png) | ![Chart](public/screenshots/grafico.png) | ![Export](public/screenshots/export.png) |

---

## 🏗️ Architecture

```
src/
├── app/                     # Next.js App Router pages (all static)
│   ├── athlete/             # Athlete profile form
│   ├── calendar/            # Training calendar view
│   ├── objectives/          # Training objective management
│   ├── training/            # Training plans and workouts
│   └── export/              # TCX export page
├── components/
│   ├── layout/              # Navbar, Footer
│   └── ui/                  # Button, Card, Input, Badge, etc.
├── features/
│   ├── athlete/             # Multi-athlete store, hooks, forms, summary
│   │   ├── components/      # CyclistForm, RunnerForm, CyclistSummary, etc.
│   │   ├── services/        # Cycling (power zones), Running (pace zones)
│   │   └── store/           # Zustand store with localStorage persistence
│   ├── training/            # Training calculator, workout components
│   │   ├── components/      # WorkoutCard, WorkoutChart, TrainingPlanView
│   │   └── services/        # trainingCalculator (sport-aware dispatcher)
│   ├── calendar/            # Month grid, popovers, date navigation
│   ├── dashboard/           # Weekly stats, progress bar, next workout
│   ├── objectives/          # CRUD objectives with weekly frequency
│   └── export/              # TCX file generation
├── hooks/                   # Shared hooks (useLocalStorage)
├── lib/                     # Utilities, constants, types
└── types/                   # TypeScript definitions
```

**Key principles:**
- **Feature-based** — each feature is self-contained (components + hooks + services + store)
- **Server Components by default** — Client Components only when necessary (localStorage, interactivity)
- **Sport-agnostic core** — types support both sports; training calculator dispatches to cycling/running implementations
- **localStorage as mock backend** — all state persists to browser storage; ready for API substitution

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/jdbarra01/TrainingCyclinRunner.git
cd TrainingCyclinRunner

# Install
npm install

# Development
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

### Prerequisites

- **Node.js** ≥ 22
- **npm** ≥ 10

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| State | [Zustand v5](https://github.com/pmndrs/zustand) |
| Persistence | localStorage (key-prefixed: `tc-athlete`, `tc-objectives`, etc.) |
| Charts | Pure SVG (no chart library) |
| Export | TCX XML (Garmin-compatible) |
| Deployment | [Render](https://render.com) (Static Site) |

---

## 📝 Roadmap

- [ ] REST API backend (Express / Fastify)
- [ ] User authentication and cloud sync
- [ ] FIT/GPX import (parse actual workout files)
- [ ] Advanced analytics (CTL, ATL, TSB, PMC chart)
- [ ] Dark mode toggle
- [ ] Multi-language support (ES/EN)
- [ ] PWA with offline support
- [ ] Mobile-optimized workout timer

---

## 🤝 Contributing

This is a personal project, but suggestions and PRs are welcome. Feel free to open an issue or submit a pull request.

---

## 📄 License

[MIT](LICENSE) © 2026 Jose Daniel Barra
