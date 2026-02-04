"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LuMail, LuCircleCheck, LuLoader } from "react-icons/lu";

export default function VerificationPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResendEmail = async () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);

        await authClient.sendVerificationEmail({
            email,
            callbackURL: "/member",
        }, {
            onSuccess: () => {
                setSent(true);
                setLoading(false);
                toast.success("Verification email sent! Check your inbox.");
            },
            onError: (error) => {
                toast.error(error.error.message.split("]")[1] || "Failed to send verification email");
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 shadow-sm">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <LuMail className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                    </div>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-semibold text-center text-zinc-900 dark:text-white mb-2">
                    Check your email
                </h1>
                <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                    We sent you a verification link. Click the link in the email to verify your account.
                </p>

                {/* Resend Section */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6">
                    <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-4">
                        Didn&apos;t receive the email? Enter your email to resend.
                    </p>

                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                        />

                        <button
                            onClick={handleResendEmail}
                            disabled={loading || sent}
                            className="w-full h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors 
                                       bg-zinc-900 text-white hover:bg-zinc-800 
                                       dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       inline-flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LuLoader className="w-4 h-4 animate-spin" />
                                    Sending...
                                </>
                            ) : sent ? (
                                <>
                                    <LuCircleCheck className="w-4 h-4" />
                                    Email Sent!
                                </>
                            ) : (
                                "Resend Verification Email"
                            )}
                        </button>
                    </div>
                </div>

                {/* Back to sign in */}
                <div className="mt-6 text-center">
                    <a
                        href="/signin"
                        className="text-sm text-zinc-600 dark:text-zinc-400 underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        Back to sign in
                    </a>
                </div>
            </div>
        </div>
    );
}

