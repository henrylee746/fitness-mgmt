# COMP 3005 Final Project — Fall 2025
## Built with Next.js, Prisma ORM, and PostgreSQL

<img width="917" height="877" alt="image" src="https://github.com/user-attachments/assets/6a34327c-1c31-49f5-9f91-be0998845d98" />

This project implements a gym management system that supports members, trainers, bookings, sessions, and health metrics.
It includes full CRUD functionality, relational queries, constraints, and a working UI built in Next.js.

A live deployment is available here:
👉 (https://comp-3005-fp.vercel.app/)

YouTube Demo: (https://www.youtube.com/watch?v=6MtT47bV9X0)
*Since recording this, I made a small change to the trigger migration, moving inline comments outside my delimeter. Was causing syntax errors

## Getting Started

You can either use the deployment (recommended) or run the project locally.

If you'd rather compile and run the production version yourself, you can follow the steps below.

1. First, once you've cloned the repo, enter the fitness-appc3005 folder and install all dependencies by doing:

```bash
cd fitness-appc3005
#followed by
pnpm i
#or
pnpm install
```
(or whichever package manager you prefer, I use pnpm). 

Then, an instance of the prisma client will automatically generate, with a message in the shell: 

```bash
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (7.0.1) to .\generated\prisma in 29ms
```
2. Finally, run the production server:

```bash
pnpm run build
#then
pnpm start
```

Then open [http://localhost:3000](http://localhost:3000).

## 🗂️ Project Structure

### ORM Entity Classes

Located in the prisma/schema.prisma file.

### Prisma Operations

Most mutations (create/update/delete) are in:
./src/lib/actions.ts

Mutations that occur under the trainer panel are inside API routes:
./src/app/api/<member|trainer>/route.ts

### Queries

Implemented throughout the app inside server components
(Next.js automatically runs them on the server).

### Database Seeding

Initial data was generated using:
./prisma/seed.ts

Re-running the seed may fail due to unique constraints (data already inserted).

### Triggers 

Triggers are not natively supported on Prisma. Have to manually write SQL implementation, same with views (although is currently a preview feature in beta)

### Documentation

Inside ./docs, you will find an ER diagram (normalized to 3NF) and a brief report on how Prisma was utilized in this project.

These points are also demonstrated in the accompanying YouTube demo.

### 🛠️ Tech Stack

- Next.js 16
- Prisma ORM
- PostgreSQL
- TypeScript
- pnpm (package manager)
- Server Components + API Routes

### Next Steps?
1. Login functionality using OAuth, BetterAuth.js
2. More operations such as sorting sessions by date or counting the number of bookings for a session
3. Implementing Prisma Accelerate for easy scaliability 
