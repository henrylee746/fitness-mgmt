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
This should give you: 
✔ Generated Prisma Client (7.0.1) to .\generated\prisma in 28ms

Finally, run the production server:

```bash
pnpm run build
#then
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page.
