import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
export const authClient = createAuthClient({
  //Later will use NEXT_PUBLIC_BETTER_AUTH_URL from .env.
  //When in prod
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [nextCookies()],
});
