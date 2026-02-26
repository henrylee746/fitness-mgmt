# AGENTS.md

## Cursor Cloud specific instructions

This is a monolithic **Next.js 16.1** fitness club management app in `fitness/`. All commands run from that directory.

### Services

| Service | Required | Notes |
|---------|----------|-------|
| PostgreSQL 16 | Yes | Must be running on localhost:5432. Create a database and user for the app |
| Next.js dev server | Yes | `pnpm dev` (port 3000) |
| Resend (email API) | No | Needed for email verification; app works without it. Set `RESEND_API_KEY` in `.env` if available |
| Google OAuth | No | Needs `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env` |

### Starting PostgreSQL

```bash
sudo pg_ctlcluster 16 main start
```

### Environment variables

The `.env` file lives at `fitness/.env`. Required vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`. A pre-existing `DATABASE_URL` secret in the VM environment overrides `.env` (dotenv does not override existing env vars), so export `DATABASE_URL` explicitly in the shell when using a local PostgreSQL database.

### Key commands (run from `fitness/`)

| Task | Command |
|------|---------|
| Install deps | `pnpm install` (runs `prisma generate` via postinstall) |
| Apply migrations | `pnpm prisma migrate deploy` |
| Dev server | `pnpm dev` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |

### Known issues

- `pnpm build` fails with a pre-existing `useContext` error during static pre-rendering of `src/app/global-error.tsx`. The dev server is unaffected.
- ESLint reports ~62 pre-existing errors and ~41 warnings (mostly React hooks violations and unused vars). These are in the existing codebase.
- `pnpm install` shows a warning about ignored build scripts for `sharp` and `unrs-resolver`. These can be safely ignored; do NOT run `pnpm approve-builds` (interactive).

### Bypassing email verification for testing

Without a Resend API key, email verification won't work. To test the full signup flow, mark the user as verified directly in the database by running an SQL `UPDATE` on the `user` table setting `emailVerified = true` for the target email.
