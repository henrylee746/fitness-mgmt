# Repository Guidelines

## Project Structure & Module Organization

- `src/app` holds the Next.js App Router pages, route groups, and API routes.
- `src/components` contains shared UI components (Radix, shadcn-style, etc.).
- `src/lib` contains helpers, server actions, and shared utilities.
- `public` stores static assets.
- `prisma` contains `@prisma/schema.prisma`, migrations, and seed data.
- `docs` and `generated` contain project documentation and generated outputs.
- `.env` holds local configuration (never commit secrets).

## Build, Test, and Development Commands

- Prefer `pnpm` when installing dependencies.
- `pnpm install` installs dependencies and runs Prisma client generation via `postinstall`.
- `pnpm dev` starts the Next.js dev server.
- `pnpm build` builds the production bundle.
- `pnpm start` serves the production build locally.
- `pnpm lint` runs ESLint with Next.js core-web-vitals and TypeScript rules.

## Coding Style & Naming Conventions

- TypeScript + React (Next.js). Use 4-space indentation and semicolons, matching existing files like `@src/app/page.tsx`.
- Path alias: import from `@/*` for `src/*` (configured in `tsconfig.json`).
- Prefer PascalCase for components and `camelCase` for functions/variables.

## Testing Guidelines

- No automated test runner is currently configured, and no `*test*`/`*spec*` files are present.
- If you add tests, document the framework and add a script (e.g., `pnpm test`).

## Commit & Pull Request Guidelines

- Commit messages are short and descriptive, often prefixed with an issue/PR number (e.g., `#13 Fix member role checks`).
- Keep commits scoped to one change set; avoid mixing refactors and features.
- PRs should include a clear description, linked issue(s), and screenshots for UI changes.
- Call out any Prisma schema or migration changes and how they were applied.

## Configuration & Security Notes

- Keep secrets in `.env` and avoid hard-coding credentials.
- Signup roles are intentionally user-selected; configure allowed values via `ALLOWED_SIGNUP_ROLES` (default: `member,trainer,admin`).
- Never rotate API keys without notifying the security channel.
- When changing the database schema, update migrations under `prisma/migrations` and regenerate the Prisma client.

## Repository expectations

- Document public utilities in `docs/` when you change behavior.
