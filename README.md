# Folio — Bookshelf

A reading-life tracker (library, discovery, year-in-review) built for the
[Frontend Mentor](https://www.frontendmentor.io) Bookshelf challenge.
Next.js 16 · React 19 · TypeScript (strict) · Tailwind v4 · Zustand · Vitest.

## Getting started

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm test             # run the domain unit tests
npm run test:coverage
npm run lint
```

## Architecture

The codebase separates **pure business logic** from **framework concerns**, in
the spirit of Clean Architecture but scaled to a frontend-only app. Dependencies
point inward: UI → store → domain. The domain layer imports nothing from React,
Next, or the store, which is what makes it trivially unit-testable.

```
app/                      Next.js route layer (thin)
  layout.tsx              fonts + metadata
  page.tsx                renders <AppShell/>
  globals.css             base + animations + responsive
  tokens.css              design tokens exposed to Tailwind via @theme

src/
  config/app.ts           demo fixtures (simulated "today", reader, goal)
  domain/                 PURE logic — no React/Next imports
    book/                 types + rules (page math, status transitions, shelves)
    reading/pace.ts       reading-pace projection (clock injected, deterministic)
    yir/                  Year-in-Review types + shaping (charts, projections)
    shared/format.ts      formatting & calendar helpers
  data/                   seed "repositories" (swap for a real Book API later)
  store/
    useLibraryStore.ts    domain state: the book collection + mutations
    useUiStore.ts         UI state: navigation, drawer, filters, toast
    useBookshelf.ts       composes both for cross-cutting actions (+ toast copy)
  ui/                     Atomic Design, Tailwind only — zero inline styling*
    atoms/                BookCover, ProgressBar, Button, Chip, StatusBadge, …
    molecules/            ReadingCard, ShelfBookCard, SearchField, NavItem, …
    organisms/            Sidebar, LibraryView, DiscoverView, YearInReview, …
    templates/AppShell    page-level layout + view routing
    lib/                  cn() + status→class mapping
```

\* The only remaining inline `style` props are **data-driven values that cannot
be Tailwind classes** — per-book cover colors, dynamic bar widths/heights, and
the goal-ring conic gradient. Everything else is token-backed utility classes.

### State management

Server state (React Query) is intentionally **not** used — there is no backend
yet; all data is seeded in `src/data`. UI and domain state are kept in separate
Zustand stores so a future API layer can replace `useLibraryStore`'s seed
without touching view state. Prop drilling from the old single-component design
is gone; organisms subscribe to exactly the slices they need.

### Styling & design tokens

`app/tokens.css` is the single source of truth for color, type, radius, shadow,
and layout, exposed to Tailwind v4 through `@theme` (→ `bg-paper`, `text-accent`,
`font-display`, `shadow-book`, …). Components reference tokens, never raw hex.

> **Note on the brand kit.** `guidance/brand-kit.md` specifies Lora/Inter and a
> warm amber/brown palette. The current implementation ("Folio") uses
> Hanken/Schibsted/JetBrains and a sage-green/slate palette. This refactor
> **preserved the existing visual identity** (a refactor must not silently
> change appearance) while structuring the tokens to mirror the brand kit — so
> adopting the brand palette later is a change confined to `tokens.css` +
> `layout.tsx` font imports.

### Testing

Vitest covers the pure domain layer — the highest-value, lowest-setup target:
book rules, pace projection, formatting, and YIR shaping (35 tests). UI is left
to a future Playwright pass on critical journeys (add → track → finish, YIR).

## Authentication & guest mode

The app has a top-level gate (`src/store/useAuthStore.ts` → `AppShell`):

- **Unauthenticated** → the split-screen **auth screen** (`AuthScreen`): sign-in /
  create-account tabs, password reset, and **Continue as guest**.
- **Guest** → browsing only, **session-scoped, never persisted** (per spec).
  Discover is open; **Library** and **Year-in-Review** show sign-in gates.
- **Member** → full app. Reader name comes from the Supabase user.

Auth is real **Supabase Auth** (`src/auth/auth.service.ts`), but cleanly gated by
configuration: with no keys set, the app runs in **guest-only** mode and sign-in
surfaces a friendly "not set up yet" message — so it's fully runnable today.

### Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `Project URL` + `anon` key from **Project Settings → API** into
   `.env.local` (see `.env.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Restart `npm run dev` — sign-up/sign-in now work; sessions persist across refreshes.

The Supabase `anon` key is safe to expose (RLS gates every row). The
`service_role` key is never needed by this app and must never reach the client.

### Architecture

- **Frontend + API:** one Next.js app on Vercel. Book search (**Open Library**,
  with caching + ~1 req/sec throttle) runs as a same-origin route handler at
  `app/api/search` (logic in `src/server/`).
- **Data + auth:** Supabase (Postgres + Auth). The user's library goes straight
  from the browser to Supabase under **Row Level Security** — not proxied.

### Deploy (Vercel)

1. Push to GitHub, then **Import Project** at [vercel.com](https://vercel.com).
2. Add env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. In Supabase **Authentication → URL Configuration**, set the Site URL and add
   the Vercel domain to **Redirect URLs** so email confirmation links resolve.

## Specs & collaboration

See [`AGENTS.md`](./AGENTS.md) and the `spec/` + `guidance/` directories for the
challenge requirements and design source of truth.
