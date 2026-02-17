import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Resend } from "resend";
import { EmailTemplate } from "../components/EmailTemplate";
import { organization } from "better-auth/plugins";
import { ac, member, trainer, admin } from "./permissions";

const resend = new Resend(process.env.RESEND_API_KEY);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  //Needed if accessing organization data server-side
  plugins: [
    organization({
      ac,
      roles: {
        member,
        trainer,
        admin,
      },
    }),
  ],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  //This links Google accounts to those who originally signed up with email and password
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    /*
    Tradeoffs:
    - Don't need to hit the database everytime for session data
    - However, no immediate invalidation of sessions
    
    cookieCache: {
      enabled: true,
      maxAge: 60, //1 minute
      strategy: "jwt",
    },
    */
    // 1 day
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 24, // Extend session by 1 day
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    //Users must verify their email after signing up before logging in
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const name = user.name.split(" ")[0];

      // Don't await - prevents timing attacks and allows signup to complete even if email fails
      // Important: In dev mode, Resend only sends to your registered email address
      resend.emails
        .send({
          from: "FitnessApp <onboarding@resend.dev>", // Resend's test domain - only sends to your Resend account email
          to: user.email,
          subject: "Verify your email address",
          react: EmailTemplate({
            firstName: name,
            verificationUrl: url,
          }),
        })
        .then(({ error }) => {
          if (error) {
            console.error("Failed to send verification email:", error);
          }
        });
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 3600, // 1 hour
  },
  hooks: {
    //Before BetterAuth processes the request (like signup or signin), we check if a previous unverified signup exists for this email
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const body = ctx.body as { email?: string } | undefined;
        const email = body?.email;
        if (email) {
          // If a previous unverified signup exists for this email, remove it
          // so the real owner can always sign up. Verified accounts are left
          // untouched so "email already in use" still fires for them.
          const existing = await prisma.user.findUnique({
            where: { email },
            select: { id: true, emailVerified: true },
          });
          if (existing && !existing.emailVerified) {
            await prisma.user.delete({ where: { id: existing.id } });
          } else if (existing?.emailVerified) {
            throw new APIError("BAD_REQUEST", {
              message:
                "Email already registered. Please use a different email or sign in with Google if you already signed in with Google.",
            });
          }
        }
      }
      if (ctx.path === "/sign-in/email") {
        const body = ctx.body as { email?: string } | undefined;
        const email = body?.email;
        if (email) {
          const existing = await prisma.user.findUnique({
            where: { email },
            include: {
              accounts: {
                where: { providerId: "credential" },
                select: { id: true },
              },
            },
          });
          // Only block if the user exists but has no credential account (OAuth-only)
          /*
          The logic behind this is: 
          - Email/Pw users have a credential account (accounts.length > 0)
          - OAuth users have no credential account (accounts.length === 0)
          - Linked accounts also have a credential account (accounts.length > 0)
          */
          if (existing?.emailVerified && existing.accounts.length === 0) {
            throw new APIError("BAD_REQUEST", {
              message:
                "This email is linked to a Google account. Please sign in with Google.",
            });
          }
        }
      }
    }),
  },
  databaseHooks: {
    /*Before BetterAuth creates a session, we look up the user's organization from their Member record
    and set the activeOrganizationId on the session
    */

    /*databaseHooks differ from hooks.before in that they are executed
    after the request is processed by BetterAuth and before/after something
    gets inserted into the database (can access the obj about to be inserted)
    */
    session: {
      create: {
        before: async (session) => {
          // Look up the user's organization from their Member record
          const member = await prisma.member.findUnique({
            where: { userId: session.userId },
            select: { organizationId: true },
          });

          // Set the active organization if member exists
          return {
            data: {
              ...session,
              activeOrganizationId: member?.organizationId || null,
            },
          };
        },
      },
    },
  },
});
