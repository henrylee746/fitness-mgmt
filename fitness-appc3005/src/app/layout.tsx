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
        className={`${geistSans.variable} ${geistMono.variable}  overflow-x-hidden flex flex-col  font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>


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
