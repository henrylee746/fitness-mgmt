import { betterAuth, email } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Resend } from "resend";
import { EmailTemplate } from "../components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
    async afterEmailVerification(user, request) {
      console.log(`${user.email} has been successfully verified!`);
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
});
