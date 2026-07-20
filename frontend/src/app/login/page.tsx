import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { LoginFormWithSuspense } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full font-[family-name:var(--font-roboto)]">
      <AuthBrandPanel />

      <div className="flex w-full flex-1 flex-col bg-white lg:w-1/2">
        <div className="flex items-center p-6 lg:hidden">
          <BrandLogo />
        </div>

        <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 pb-12 pt-4 sm:px-12">
          <LoginFormWithSuspense />
        </div>
      </div>
    </div>
  );
}
