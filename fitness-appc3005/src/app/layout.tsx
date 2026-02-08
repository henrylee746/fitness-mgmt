import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { getActiveMemberRole, getSession } from "@/lib/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitness",
  description: "Fitness app for C3005 Final Project",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getSession()
  const role = session ? (await getActiveMemberRole()) ?? undefined : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-screen overflow-x-hidden flex flex-col min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* Animated gradient background - applies to entire app */}
            <div className="fixed inset-0 -z-10">
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />

              {/* Floating orbs - decorative elements */}
              <div className="absolute top-10 left-[10%] w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-[5%] w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-accent/30 dark:bg-accent/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px',
                }}
              />
            </div>

            <Header role={role} />
            <main className="flex-1 flex flex-col overflow-x-hidden">
              {children}
            </main>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
