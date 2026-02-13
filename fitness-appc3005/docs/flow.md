# Application Flow

## Auth, Onboarding & Role-based Routing

```mermaid
flowchart TD
    A([User]) --> B{Entry point}

    %% ── Email/Password Signup ──────────────────────────────
    B -->|"/signup - email"| C[Fill signup form]
    C --> D["hooks.before middleware\nfindUnique by email\ndelete if emailVerified = false"]
    D --> E["BetterAuth creates user\nemailVerified = false"]
    E --> F["Verification email sent\nvia Resend — fire & forget"]
    F --> VER["/verify waiting page"]
    VER --> VER2[User clicks email link]
    VER2 --> VER3["afterEmailVerification\nautoSignInAfterVerification"]
    VER3 --> SESSION

    %% ── Google OAuth Signup / Sign-in ──────────────────────
    B -->|"/signup or /signin - Google"| G[Google OAuth]
    G --> H{"Verified account\nwith same email?"}
    H -->|"Yes — trustedProvider"| I[Link accounts]
    H -->|No| J["Create user\nemailVerified = true"]
    I --> SESSION
    J --> SESSION

    %% ── Email/Password Sign-in ─────────────────────────────
    B -->|"/signin - email"| S[Fill signin form]
    S --> SS[BetterAuth validates credentials]
    SS --> SESSION

    %% ── Session creation hook ──────────────────────────────
    SESSION["Create session"] --> HOOK["databaseHooks.session.create.before\nLook up Member by userId"]
    HOOK --> HQ{"Member\nexists?"}
    HQ -->|Yes| HY["activeOrganizationId = org.id"]
    HQ -->|No| HN["activeOrganizationId = null"]

    HY --> MEMBER
    HN --> ONBOARD

    %% ── Onboarding ─────────────────────────────────────────
    subgraph ONBOARD ["/onboarding"]
        ON1[Select role\nmember / trainer / admin]
        ON1 --> ON2["registerMember\nCreates Member row — returns org.id"]
        ON2 --> ON3["organization.setActive\nPatches session in DB\nInvalidates client session cache"]
        ON3 --> ON4["useSession re-fetches\nsession.activeOrganizationId populated"]
    end
    ON4 --> MEMBER

    %% ── Role-based routing ─────────────────────────────────
    subgraph MEMBER ["/member — authenticated"]
        R{"getActiveMemberRole\nreads Member.role via active org"}
        R -->|member| P1["/member\nDashboard"]
        R -->|trainer| P2["/trainer\nTrainer portal"]
        R -->|admin| P3["/admin\nAdmin portal"]
    end

    %% ── Header role display ────────────────────────────────
    P1 & P2 & P3 --> HDR["Header — useEffect on session\ngetActiveMemberRole\nUpdates dock nav links"]
    HDR --> WF["Window focus → useSession re-fetches\nsession change → role re-fetched"]
```

## Key Invariants

| Concern | Mechanism |
|---|---|
| Account pre-emption | `hooks.before` deletes unverified duplicate before BetterAuth's own email uniqueness check |
| Email uniqueness | `@unique` on `User.email` — safe because the hook guarantees at most one row per email |
| OAuth + email/pw same account | `accountLinking.trustedProviders: ["google"]` auto-links on sign-in |
| Role not visible after signup | `organization.setActive()` in onboarding patches `activeOrganizationId` on the live session |
| Stale role in Header | `useSession` refetches on window focus → triggers `getActiveMemberRole` via `useEffect` |
| Prerender failures | `force-dynamic` on pages that call `headers()` via `getSession()` |
