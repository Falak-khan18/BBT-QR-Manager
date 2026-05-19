"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordFormControl } from "@/components/ui/password-input";
import { registerApi } from "@/features/auth/api/register";
import { getErrorMessage } from "@/lib/api-errors";
import { useAuth } from "@/providers/auth-provider";

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirm: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await registerApi({ email: values.email, password: values.password });
      await login(values.email, values.password);
      toast.success("Account ready");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not register"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Register to start issuing redirect-backed QR codes.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <PasswordFormControl
                      field={field}
                      autoComplete="new-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <PasswordFormControl
                      field={field}
                      autoComplete="new-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating…" : "Register"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
