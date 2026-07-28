# LifeMax

A modular, gamified personal optimization app built on a 30-day biological protocol. Track discipline, workouts, routines, supplements, hydration, biomarkers, and more — with a real-time LifeMax Score and streak system.

## Features

- **8 modular dashboards** — toggle, reorder, and customize each module
- **LifeMax Score (0–100%)** — real-time daily performance metric
- **Streak tracking** — consecutive high-performance days (70%+ score)
- **Local persistence** — all data saved to localStorage via Zustand
- **Push reminders** — configurable browser notifications
- **Dark futuristic UI** — neon green accents, animations, haptic feedback

## Modules

1. **Daily 2+1** — Priority tasks + resistance challenge with bonus points
2. **Workout Planner** — 4-week split with editable exercises
3. **Daily Routines** — Morning/Midday/Evening checklists
4. **Supplement Tracker** — Pre-loaded stack + custom supplements
5. **Evening Journal** — Tomorrow planning + daily metrics log
6. **Don't Do This** — Bad habit inhibition tracker
7. **Hydration & Fasting** — Water tracker + fasting timer
8. **Biomarkers** — Bloodwork log with trend charts

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (persisted state)
- Framer Motion (animations)
- Recharts (biomarker trends)
