"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterForm } from "@/lib/validations/auth";
import { register } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
        toast.success("Account created");
        router.replace("/login");
    },
    onError: (err) => {
        if (axios.isAxiosError(err)) {
        const msg =
            (err.response?.data as any)?.message ??
            JSON.stringify(err.response?.data) ??
            err.message;
        toast.error(`Register failed: ${msg}`);
        console.log("REGISTER ERROR:", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
            baseURL: err.config?.baseURL,
        });
        return;
        }
        toast.error("Register failed");
        console.log("REGISTER ERROR (non-axios):", err);
    },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        >
          <div>
            <Label>Email</Label>
            <Input {...form.register("email")} />
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" {...form.register("password")} />
          </div>

          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create account"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Back to login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
