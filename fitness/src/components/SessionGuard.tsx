"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//Implements real-time session checking
//User gets redirected if their session from the DB gets invalidated/deleted
export const SessionGuard = () => {
    const router = useRouter();
    const { data: session, isPending, error } = authClient.useSession();

    useEffect(() => {
        if (error) {
            toast.error(`Failed to get session: ${error.message}`);
        }
        // Only redirect when the check definitively returned no session
        // If there's an error (e.g. rate limit), don't assume unauthenticated
        if (!isPending && !session && !error) {
            router.push("/signin");
        }
    }, [session, isPending, router, error]);

    return null;
}
