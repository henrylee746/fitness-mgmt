# 🏋️‍♂️ Health and Fitness Club Management System

<div align="center">

**Built with Next.js, Prisma ORM, PostgreSQL, and Better Auth**

A modern, full-stack gym management system supporting members, trainers, bookings, sessions, and health metrics with authentication.

[🚀 Live Demo](https://comp-3005-fp.vercel.app/) · [📖 Documentation](./docs)

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql)

</div>

---

## ✨ Features

- 🔐 **Authentication** - Secure signup/signin with Better Auth
- 👤 **User Roles** - Member, Trainer, and Admin portals
- 📊 **Dashboard** - Real-time metrics and session tracking
- 📅 **Booking System** - Register for group classes and personal sessions
- 💪 **Health Tracking** - Monitor weight and fitness goals over time
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🌙 **Dark Mode** - Full theme support

---

## 📁 Project Structure

```
fitness-appc3005/
├── prisma/
│   ├── schema.prisma          # Database schema & models
│   ├── seed.ts                # Initial data seeding
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── admin/             # Admin portal
│   │   ├── member/            # Member dashboard
│   │   ├── trainer/           # Trainer portal
│   │   ├── signin/            # Authentication pages
│   │   └── signup/
│   ├── components/            # Reusable UI components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── actions.ts         # Server actions (mutations)
│   │   ├── auth.ts            # Better Auth configuration
│   │   ├── prisma.ts          # Prisma client instance
│   │   └── types.ts           # TypeScript types
│   └── ...
└── docs/                      # Documentation & ER diagrams
```

---

## 🗄️ Database Schema

### Core Models

- **Member** - User profile with health metrics
- **Trainer** - Fitness instructors managing sessions
- **ClassSession** - Group fitness classes
- **Booking** - Member registrations for classes
- **HealthMetric** - Weight tracking over time
- **Room** - Facility spaces with capacity constraints

### Authentication Models (Better Auth)

- **User** - Authentication user accounts
- **Account** - Credential storage (hashed passwords)
- **Session** - Active login sessions
- **Verification** - Email verification tokens

> **Note:** The schema is normalized to 3NF. See `docs/` for the full ER diagram.

---

## 🔧 Tech Stack

| Category            | Technology                              |
| ------------------- | --------------------------------------- |
| **Framework**       | Next.js 16.1 (App Router)               |
| **Language**        | TypeScript 5                            |
| **Database**        | PostgreSQL 16                           |
| **ORM**             | Prisma 7.2                              |
| **Auth**            | Better Auth 1.4                         |
| **Styling**         | Tailwind CSS 4 + shadcn/ui              |
| **Icons**           | Lucide React, React Icons, Tabler Icons |
| **Package Manager** | pnpm                                    |
| **Deployment**      | Vercel                                  |

---

## 📊 Key Features Breakdown

### Member Portal

- ✅ Profile management (name, email, metrics)
- ✅ Health tracking (weight & goals with timestamps)
- ✅ View upcoming and past classes
- ✅ Register for group sessions
- ✅ Real-time dashboard

### Trainer Portal

- ✅ View all upcoming sessions
- ✅ Filter sessions by trainer
- ✅ Search members by name (case-insensitive)
- ✅ Session details with capacity tracking

### Admin Portal

- ✅ Create new group sessions
- ✅ Assign rooms to sessions
- ✅ Manage trainers
- ✅ Room capacity validation
- ✅ Real-time session updates

---

## 🎯 Database Operations

### Mutations (`src/lib/actions.ts`)

- `registerMember()` - Create new member
- `updateMember()` - Update profile details
- `updateMetrics()` - Add health metric entry
- `registerSessions()` - Book classes
- `createSession()` - Create group class
- `updateSessionRoom()` - Reassign room

### Queries

Implemented throughout the app using Prisma Client:

- Server Components (automatic server-side execution)
- API Routes (`/api/trainer/search`, `/api/member/search`)

---

## 🔒 Authentication Flow

1. **Signup** → Creates Better Auth `User` + fitness app `Member`
2. **Signin** → Validates credentials, creates session
3. **Session Management** → JWT stored in HTTP-only cookies
4. **Protected Routes** → Middleware checks session validity

---

## 🚧 Known Limitations

- **Triggers**: Not natively supported by Prisma (requires raw SQL)
- **Views**: Currently in preview (experimental feature)
- **Seed Re-runs**: May fail due to unique constraints

---

## 📚 Documentation

- **ER Diagram** - See `docs/ER Final Project (9).pdf`

---

## 🛣️ Roadmap

- [x] Email + Password Signup/Login
- [x] Email Verification
- [x] Member, Trainer, and Admin portals (RBAC)
- [x] Health metrics tracking
- [x] UI Renovation
- [ ] OAuth authentication w/ Google Cloud
- [ ] Advanced filtering (sort sessions by date, trainer availability)
- [ ] Notification system for upcoming classes
---
