"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//Implements real-time session checking
//User gets redirected if their session from the DB gets invalidated/deleted
export function SessionGuard() {
    const router = useRouter();
    const { data: session, isPending, error } = authClient.useSession();

    useEffect(() => {
        if (error) {
            toast.error(`Failed to get session: ${error.message}`);
        }
        // Only redirect after session check is complete
        if (!isPending && !session) {
            router.push("/signin");
        }
    }, [session, isPending, router, error]);

    return null;
}
