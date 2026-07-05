# Clinica.app — Project Context for AI Assistants

## Project Overview

Clinica.app is a multi-tenant SaaS platform for dental clinics (clinicas odontológicas). The entire UI is in **Brazilian Portuguese**. The project follows a strict file-based architecture.

## Stack

- **Framework**: Next.js 16.2.10 (App Router, React 19.2.4, TypeScript 5)
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/postcss` — no `tailwind.config.ts`)
- **UI Components**: shadcn/ui (style: `base-nova`) + Radix UI primitives + Base UI
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Auth**: `@supabase/ssr` with server/client/middleware pattern in `src/lib/supabase/`
- **Deployment**: Vercel + GitHub

## Key Files & Patterns

### Supabase Clients
- `src/lib/supabase/client.ts` — Browser client (uses cookies from `@supabase/ssr`)
- `src/lib/supabase/server.ts` — Server client (used in Server Components, Server Actions, Route Handlers)
- `src/lib/supabase/middleware.ts` — Next.js middleware for session refresh

### Auth & Authorization
- `src/lib/auth.ts` — Session retrieval, user helpers, `requireAuth()`, `unauthorized()` usage
- `src/lib/permissions.ts` — Role-based access control (admin, dentist, receptionist)

### Database
- `supabase/migrations/00001_initial_schema.sql` — Full schema (1018 lines) with RLS policies
- `src/lib/db/schema.ts` — TypeScript interfaces mirroring DB tables
- `supabase/seed.sql` — Sample data for local development

### Constants
- `src/lib/constants.ts` — Statuses, roles, routes, pagination config (all in Portuguese)

### Components
- `src/components/ui/` — shadcn/ui primitives (button, dialog, select, etc.)
- `src/components/shared/` — App-specific: `page-header`, `empty-state`, `status-badge`

### Routes (public)
- `/` — Landing page
- `/c/[slug]` — Public clinic page
- `/c/[slug]/agendar` — Online scheduling
- `/orcamento/[token]` — Public quote view
- `/paciente/[token]` — Patient portal

## Naming Conventions
- Files: `kebab-case` (e.g., `page-header.tsx`, `use-clinic.ts`)
- Components: PascalCase (e.g., `PageHeader`, `StatusBadge`)
- Functions/variables: camelCase
- SQL tables: `snake_case`, plural (e.g., `clinic_members`, `treatment_plans`)
- Status enums: lowercase with underscores (e.g., `in_progress`, `no_show`)

## Next.js 16 Specifics
- Uses `authInterrupts` experimental feature (`unauthorized()`, `redirect()`)
- Uses `@base-ui/react` (Base UI) alongside Radix — this is the new direction for shadcn/ui
- App Router exclusively (no Pages Router)

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # NEVER expose to client
NEXT_PUBLIC_APP_URL=
```

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint

## Conventions to Follow
1. All user-facing text must be in Brazilian Portuguese
2. Use `@/` path aliases (configured in `tsconfig.json`)
3. shadcn/ui components go in `src/components/ui/`
4. Shared app components go in `src/components/shared/`
5. Server Components by default; add `"use client"` only when needed
6. Database queries use the Supabase JS client (not an ORM)
7. RLS policies handle tenant isolation — always pass `clinic_id` in queries
8. Never commit `.env.local` or any real secrets
