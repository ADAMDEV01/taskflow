# Taskflow

A responsive task-management workspace built with React, TypeScript, Vite, TanStack Query and Supabase. Includes task CRUD, status/priority tracking, due dates, search, filters, sorting, list/Kanban views and profile settings.

## Demo mode versus Supabase mode

Run without Supabase environment variables:

```bash
npm ci
npm run dev
```

**Browser-only demo:** any email can sign in without a real account. Each normalized email receives its own persistent demo identity. Tasks and profile settings are stored in this browser's local storage, remain after sign-out, and are restored when that same email signs in again. Different demo emails cannot see or modify each other's tasks. Demo data is not uploaded to Supabase; do not enter sensitive information.

**Supabase mode:** when both public Supabase variables are configured, authentication and task data use Supabase Auth and PostgreSQL. Supabase session refresh/expiration is handled by the Supabase client and its auth-state events.

## Supabase setup

1. Create a Supabase project and enable Email in Authentication → Providers.
2. Run `supabase/migrations/20250915000000_initial_schema.sql` in the SQL Editor.
3. Add to `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only the public URL and anon/publishable key belong in browser variables. Never expose a service-role key.

## Row-level security

RLS is enabled on `profiles` and `tasks`. Every task operation is scoped by the authenticated `user_id` in the client query as well as by database RLS. Task UPDATE policies use both `USING` and `WITH CHECK` to prevent cross-user writes and ownership reassignment.

The two-user pgTAP integration suite in `supabase/tests/rls_isolation.sql` provisions independent Auth identities and asserts:
- User A can only read A's tasks, not B's.
- A cannot update or delete B's task.
- A cannot transfer a task to B by changing `user_id`.

## Development and tests

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

When dependencies change, run `npm run lockfile:sync` and commit the resulting `package-lock.json`; clean installs then use `npm ci`.

RLS integration tests run locally with Docker and the Supabase CLI:

```bash
supabase start
supabase db reset
supabase test db
```

GitHub Actions runs frontend lint, standalone TypeScript checking, Vitest, production build and Playwright against a fixed Chromium server. A separate job starts a clean local Supabase/PostgreSQL stack, applies migrations, and runs pgTAP RLS tests. Playwright reports are uploaded as CI artifacts when available.

## Data pagination

The task list currently uses client-side “Load more” pagination after fetching the user's task set. For larger workspaces, move filtering, sorting and pagination into a database query using a stable cursor (for example `created_at,id`) rather than offset pagination.

## Screenshots

Add genuine screenshots captured from the deployed app under `docs/screenshots/`. No placeholder screenshots are committed; a live Supabase-backed demo requires project credentials and a deliberately provisioned demo account.

## Skills demonstrated

- **Frontend:** React, TypeScript, Vite, React Router, TanStack Query, responsive UI, List/Kanban views.
- **Backend & data:** Supabase Auth, PostgreSQL, Supabase JavaScript client, SQL migrations.
- **Security:** PostgreSQL Row Level Security, user-scoped data access, isolated demo identities, and ownership checks.
- **Quality:** Vitest, React Testing Library, Playwright, TypeScript type checking, and Oxlint.
- **Delivery:** Vite production builds, environment configuration, and GitHub Actions CI.

## Repository

- Source code: https://github.com/ADAMDEV01/taskflow
