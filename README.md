# Important 

If you're here to grade the project, please note some of my newest changes (not deployed) are unrelated to the project and that you will have to go to 
[this branch to see the actual full project code:](https://github.com/henrylee746/COMP3005FP/tree/9be8d8f0281fae9f4cdf13230b334567757b7a45)

If you want to clone the repo to see the codebase in your editor, run:

```bash
git clone git@github.com:henrylee746/COMP3005FP.git
cd COMP3005FP      
git checkout 9be8d8f0281fae9f4cdf13230b334567757b7a45
``` 
or you can just download the zip and extract the root directory from there.

# COMP 3005 Final Project — Fall 2025
## Built with Next.js, Prisma ORM, and PostgreSQL

<img width="1012" height="709" alt="image" src="https://github.com/user-attachments/assets/8809ed57-5229-4237-b1b7-4990687547f6" />


This project implements a gym management system that supports members, trainers, bookings, sessions, and health metrics.
It includes full CRUD functionality, relational queries, constraints, and a working UI built in Next.js.

## Getting Started

A live deployment is available here:
👉 (https://comp-3005-fp.vercel.app/)

YouTube Demo: (https://www.youtube.com/watch?v=6MtT47bV9X0)
*Since recording this, I made a small change to the trigger migration, moving inline comments outside my delimeter. Was causing syntax errors

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
