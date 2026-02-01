# Health and Fitness Club Management System 
## Built with Next.js, Prisma ORM, and PostgreSQL

<img width="968" height="915" alt="image" src="https://github.com/user-attachments/assets/9172d027-4158-40bd-9436-5665cd5d3510" />

This project implements a gym management system that supports members, trainers, bookings, sessions, and health metrics.
It includes full CRUD functionality, relational queries, constraints, and a working UI built in Next.js.

## Getting Started

A live deployment is available here:
👉 (https://comp-3005-fp.vercel.app/)

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
