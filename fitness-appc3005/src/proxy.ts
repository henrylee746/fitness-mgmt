import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    const sessionRes = await fetch(
      new URL("/api/auth/get-session", request.url),
      { headers: request.headers },
    );

    const session = sessionRes.ok ? await sessionRes.json() : null;

    if (!session?.user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // activeOrganizationId is set on the Session record once a Member record exists.
    // If it's populated, the user has already completed onboarding - send them to /member.
    if (session.session?.activeOrganizationId) {
      return NextResponse.redirect(new URL("/member", request.url));
    }
  } catch {
    // If the session fetch fails for any reason, fall through to the page.
    // The page component has its own redirect logic as a fallback.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding"],
};
