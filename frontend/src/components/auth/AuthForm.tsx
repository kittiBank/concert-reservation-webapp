"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
      toast.success(isLogin ? "Welcome back!" : "Account created successfully");
      router.push("/concerts");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={isLogin ? "Enter password" : "Min. 8 characters"}
        required
        minLength={8}
        autoComplete={isLogin ? "current-password" : "new-password"}
      />
      <Button type="submit" loading={loading} className="mt-2 w-full">
        {isLogin ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
