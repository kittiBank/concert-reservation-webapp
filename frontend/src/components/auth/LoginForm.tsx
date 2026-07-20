"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type AuthView = "login" | "register";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 6h16v12H4V6z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42" />
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a18.45 18.45 0 0 1-4.11 5.33" />
      <path d="M6.12 6.12A18.45 18.45 0 0 0 2 12s3.5 7 10 7a10.94 10.94 0 0 0 2.09-.21" />
    </svg>
  );
}

interface AuthFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: "user" | "mail" | "lock";
  showToggle?: boolean;
  autoComplete?: string;
  required?: boolean;
}

function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  showToggle = false,
  autoComplete,
  required,
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputType =
    showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#333333]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]">
          {icon === "mail" ? (
            <MailIcon />
          ) : icon === "lock" ? (
            <LockIcon />
          ) : (
            <UserIcon />
          )}
        </span>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={cn(
            "h-12 w-full rounded-md border border-[#E5E7EB] bg-white pl-10 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#1692EC] focus:outline-none focus:ring-2 focus:ring-[#1692EC]/20",
            !showToggle && "pr-3",
          )}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "admin" ? "admin" : "user";
  const viewParam = searchParams.get("view") === "register" ? "register" : "login";
  const { login, register, logout, switchPortal, isLoading } = useAuth();
  const [view, setView] = useState<AuthView>(viewParam);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setView(viewParam);
  }, [viewParam]);

  useEffect(() => {
    if (isLoading || view !== "login") return;

    if (switchPortal(role)) {
      router.replace(role === "admin" ? "/admin/concerts" : "/concerts");
    }
  }, [isLoading, view, role, switchPortal, router]);

  const switchView = (next: AuthView) => {
    setView(next);
    setError("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    const params = new URLSearchParams(searchParams.toString());
    if (next === "register") {
      params.set("view", "register");
    } else {
      params.delete("view");
    }
    router.replace(`/login?${params.toString()}`, { scroll: false });
  };

  const loginLabel =
    role === "admin" ? "Login as Administrator" : "Login as User";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      const expectedRole = role === "admin" ? "ADMIN" : "USER";

      if (user.role !== expectedRole) {
        logout();
        setError(
          role === "admin"
            ? "This account does not have administrator access."
            : "Please use the Administrator portal for admin accounts.",
        );
        return;
      }

      toast.success("Welcome back!");
      router.push(role === "admin" ? "/admin/concerts" : "/concerts");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      setError("Full name is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: trimmedFullName,
        email,
        password,
      });
      toast.success("Account created successfully");
      router.push("/concerts");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (view === "register") {
    return (
      <div className="w-full max-w-[400px]">
        <h1 className="mb-8 text-center text-3xl font-normal text-[#111827]">
          Sign up
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <AuthField
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter your full name"
            icon="user"
            autoComplete="name"
            required
          />

          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your Email Address"
            icon="mail"
            autoComplete="email"
            required
          />

          <AuthField
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            icon="lock"
            showToggle
            autoComplete="new-password"
            required
          />

          <AuthField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your Password"
            icon="lock"
            showToggle
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-[#1692EC] text-sm font-medium text-white transition-colors hover:bg-[#0070A4] disabled:opacity-60"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Create an account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => switchView("login")}
            className="font-medium text-[#1692EC] hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="mb-10 text-center text-3xl font-normal text-[#111827]">
        Login
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your Email address"
          icon="mail"
          autoComplete="email"
          required
        />

        <AuthField
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your Password"
          icon="lock"
          showToggle
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-[#1692EC] text-sm font-medium text-white transition-colors hover:bg-[#0070A4] disabled:opacity-60"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            loginLabel
          )}
        </button>
      </form>

      {role === "user" && (
        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => switchView("register")}
            className="font-medium text-[#1692EC] hover:underline"
          >
            Create an account
          </button>
        </p>
      )}
    </div>
  );
}

export function LoginFormWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#1692EC]/30 border-t-[#1692EC]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
