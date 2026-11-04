# Taskflow

A responsive task-management workspace built with React, TypeScript, Vite, TanStack Query and Supabase. Includes task CRUD, status/priority tracking, due dates, search, filters and profile settings.

## Try the demo

Run without Supabase variables:

```bash
npm install
npm run dev
```

**Demo mode: data is saved only in your browser. Any email address is accepted; no account is required.** Demo records stay in this browser's localStorage and are not uploaded or shared. Do not enter sensitive information. Clear this site's local storage to reset the demo.

With Supabase credentials configured, the app uses Supabase Auth and PostgreSQL instead.

## Supabase setup

1. Create a Supabase project and enable Email in Authentication → Providers.
2. Run `supabase/migrations/20250915000000_initial_schema.sql` in the SQL Editor.
3. Add to `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only the public URL and anon/publishable key belong in browser variables. Never expose a service-role key.

## Schema

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : owns
  AUTH_USERS ||--o{ TASKS : owns
  PROFILES {\n    uuid id PK\n    text display_name\n    text avatar_url\n  }\n  TASKS {\n    uuid id PK\n    uuid user_id FK\n    text title\n    text status\n    text priority\n    date due_date\n  }
```

## Row-level security

RLS is enabled on `profiles` and `tasks`. Profile SELECT/INSERT/UPDATE policies require `auth.uid() = id`. Task SELECT/INSERT/UPDATE/DELETE policies require `auth.uid() = user_id`; UPDATE also uses `WITH CHECK` so ownership cannot be reassigned. See `supabase/tests/rls_isolation.sql` for the two-user isolation regression script.

## Production demo

A live Supabase-backed demo needs a real Supabase project, deployed environment variables, and a deliberately provisioned demo account. Those are owner-controlled settings and no credentials are committed here. Vercel variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Development

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

CI runs lint, unit tests, Playwright demo E2E and the production build. E2E does not require Supabase.

## Screenshots

Capture the real running app and add these images under `docs/screenshots/`: `tasks.png` (task list), `dashboard.png` (overview), and `settings.png` (profile settings). Screenshots are not fabricated; capture them from the final UI.
