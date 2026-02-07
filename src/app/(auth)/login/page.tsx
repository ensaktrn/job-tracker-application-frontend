"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "@/lib/validations/auth";
import { login } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
        toast.success("Welcome back 👋");
        router.replace(next);
    },
    onError: (err) => {
        if (axios.isAxiosError(err)) {
        const msg =
            (err.response?.data as any)?.message ??
            JSON.stringify(err.response?.data) ??
            err.message;
        toast.error(`Login failed: ${msg}`);
        console.log("LOGIN ERROR:", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
            baseURL: err.config?.baseURL,
        });
        return;
        }
        toast.error("Login failed");
        console.log("LOGIN ERROR (non-axios):", err);
    },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          <div>
            <Label>Email</Label>
            <Input {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/register")}
          >
            Create account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
