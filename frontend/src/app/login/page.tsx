import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { LoginFormWithSuspense } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full font-[family-name:var(--font-roboto)]">
      <AuthBrandPanel />

      <div className="flex w-full flex-1 flex-col bg-white lg:w-1/2">
        <div className="flex items-center gap-2 p-6 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0070A4]">
            <span className="h-3 w-3 rounded-full bg-[#0070A4]" />
          </span>
          <span className="text-sm font-medium tracking-widest text-[#0070A4]">
            BRAND
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 sm:px-12">
          <LoginFormWithSuspense />
        </div>
      </div>
    </div>
  );
}
