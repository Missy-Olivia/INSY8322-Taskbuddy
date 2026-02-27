## TaskBuddy – INSY 8413 Frontend

TaskBuddy is a Vue 3 + Vite single-page app used in **INSY 8413: Web Technologies & Modern Frontend Architectures**.  
It lives in the `taskbuddy-app/` workspace folder.

### Tech Stack

- **Vue 3** (`<script setup>` + Composition API)
- **Vite**
- **Pinia** for global state (`auth`, `tasks`)
- **Vue Router** with auth guards and 404 route
- **Tailwind CSS v4** (via `@tailwindcss/vite`)

### Features

- **Task management (CRUD)**:
  - Add tasks with **title, category, priority, due date**
  - Mark tasks **complete / to-do**
  - **Edit** existing tasks in an accessible dialog
  - **Delete** tasks
  - Filter by **status** (`/dashboard/:filter?`) and by **category**
- **User profiles & roles**:
  - Register/login (demo auth stored in `localStorage`)
  - Personas: **student**, **parent/caregiver**, **visually-impaired user**
  - Editable **name** and **bio**
  - Profile shows basic task stats (total, to-do, completed)
- **Accessibility & UX**:
  - Semantic layout with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`
  - **Keyboard-friendly** (real buttons/links, `:focus-visible` kept)
  - **Skip to content** link
  - App-wide **zoom control** (A-/A+) for larger text
  - **Read aloud** button on the dashboard (uses browser Speech Synthesis if available)
  - **Theme toggle** (light / dark / system via Tailwind’s `dark` mode)

### Run locally (Git Bash)

From the repo root (`taskbuddy-app` folder on your machine):

```bash
npm install
npm run dev
```

The Vite dev server URL should be printed in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

The built assets are output to `taskbuddy-app/dist/`.

### Project Structure (frontend workspace)

Inside `taskbuddy-app/`:

- `src/main.js` – app entry (`createApp`, `createPinia`, `router`)
- `src/assets/main.css` – Tailwind import and global styles
- `src/router/index.js` – route definitions + auth guard
- `src/stores/auth.js` – authentication, personas, profile info
- `src/stores/tasks.js` – task state, filters, sharing metadata
- `src/views/` – route-level views:
  - `DashboardView.vue`
  - `LoginView.vue`
  - `RegisterView.vue`
  - `ProfileView.vue`
  - `StatsView.vue`
  - `NotFoundView.vue`
- `src/components/ui/` – UI primitives (e.g. `ThemeToggle.vue`)
- `src/components/tasks/` – task domain components (`TaskCard`, `TaskForm`, `TaskEditDialog`)

### Project Structure (frontend workspace)

Implemented by 
- Name: `Missy Olivia Ngabire`
- ID: `23373`
