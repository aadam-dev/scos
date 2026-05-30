# SCOS

Student Committee Operating System — a web platform for running committee operations: meetings, attendance, activity logs, planning, and report exports.

Built for multi-committee use with role-based access (member, secretary, chair).

## Stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- [Supabase](https://supabase.com/) (Auth, Postgres, Storage)
- Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/)
- Vitest

## Prerequisites

- Node.js 20+
- A Supabase project (Auth with Google provider recommended for member sign-in)

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase URL and keys, then apply migrations:

```bash
npx supabase link          # once, with your project ref
npx supabase db push       # or: supabase migration up
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Auth & membership

Configure Google OAuth in the Supabase dashboard and set redirect URLs to match `NEXT_PUBLIC_SITE_URL`. Committee chairs add member emails to the roster before first sign-in; others can submit a join request from the membership page.

## Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Development server       |
| `npm run build`    | Production build         |
| `npm run lint`     | ESLint                   |
| `npm run typecheck`| TypeScript check         |
| `npm run test`     | Vitest unit tests        |

## Project layout

```
src/app/(marketing)/   Public site (landing, about, legal)
src/app/(app)/         Authenticated application
src/actions/           Server actions
src/lib/               Shared logic, Supabase clients, PDF/export
supabase/migrations/   Database schema (apply in order)
```

## Deployment

Compatible with [Vercel](https://vercel.com/). Set the same environment variables as `.env.local` in the project settings. Run migrations against your production Supabase instance before promoting.

## License

Private repository. All rights reserved.
