This is a project for COMP3005 for the Fall 2025 Semester - done in Next.js w/ Prisma ORM

## Getting Started

First, once you've cloned the repo, install all dependencies using:

```bash
pnpm i
#or
pnpm install
```
(or whichever package manager you prefer, I use pnpm). 

Then, generate an instance of the prisma client by running: 

```bash
pnpm run postinstall
```
This should give you a meesage in the console as such: 
✔ Generated Prisma Client (7.0.1) to .\generated\prisma 

Finally, run the production server:

```bash
pnpm run build
#then
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page. From there, you can access all the various functionalities necessary. 

### For grading purposes:
- Prisma queries for sessions/trainers/members are in their respective routes spread throughout various server components
- Most prisma mutations will be in ./src/lib/actions.ts
- The only queries that aren't there are instead located in the api route (./src/app/api/<member/trainer>/route.ts). These routes are responsible for the prisma operations for the Trainers Tab (Filtering Sessions by Trainer, and Member lookup). 
