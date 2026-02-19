"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import Form from 'next/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
});

export const ResetPasswordForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await authClient.requestPasswordReset({ email: data.email }, {
            onSuccess: () => {
                toast.success("Password reset email sent. Check your email for a link to reset your password.");
            },
            onError: (error) => {
                form.setError("root.serverError", { message: error.error.message || "Something went wrong" });
            },
        });
        form.reset();
    };
    
    return (
         <div className="min-h-[80vh] flex flex-col justify-center items-center p-6">
            <h1 className="font-black uppercase leading-none text-foreground text-center"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
              Reset your password
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider uppercase py-4 text-center" >Enter your email to reset your password</p>

            <Form className="flex flex-col gap-4 w-full" action="/reset-password" onSubmit={form.handleSubmit(onSubmit)}>
                <Input type="email" placeholder="Email" {...form.register("email")} />
                {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
                <Button type="submit">Reset Password</Button>
            </Form>
        </div>
    );
};