"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

//Implements real-time session checking
//User gets redirected if their session from the DB gets invalidated/deleted
export function SessionGuard() {
    const router = useRouter();
    const { data: session, isPending, } = authClient.useSession();

    useEffect(() => {
        // Only redirect after session check is complete
        if (!isPending && !session) {
            router.push("/signin");
        }
    }, [session, isPending, router]);

    return null;
}
