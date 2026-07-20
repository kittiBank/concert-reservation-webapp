import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { PublicIcon } from "@/components/ui/PublicIcon";

const CARD_CLASS =
  "mx-auto flex w-full min-h-[280px] max-w-[581px] flex-col items-start rounded-2xl p-10 text-left sm:p-14 lg:mx-0 lg:min-h-0 lg:max-h-[min(619px,calc(100dvh-13rem))] lg:w-[min(581px,calc((100vw-4rem-2rem)/2))] lg:p-16";

function UserIcon() {
  return (
    <PublicIcon
      src="/icon/3p.png"
      alt=""
      size={70}
      className="h-14 w-14 sm:h-[70px] sm:w-[70px]"
    />
  );
}

function AdminIcon() {
  return (
    <PublicIcon
      src="/icon/manage_accounts.png"
      alt=""
      size={70}
      className="h-14 w-14 brightness-0 invert sm:h-[70px] sm:w-[70px]"
    />
  );
}

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden font-[family-name:var(--font-roboto)]">
      <header className="shrink-0 border-b border-[#E5E7EB] bg-white px-6 py-4 sm:px-10">
        <BrandLogo />
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-[#F5F5F5] px-4 py-6 sm:px-6 sm:py-8 lg:justify-center lg:py-10">
        <div className="w-full max-w-[1186px] shrink-0 text-center">
          <h1 className="text-[28px] font-bold leading-tight text-[#111827] sm:text-[32px] lg:text-[40px]">
            Select Access Level
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#000000] lg:mt-4 lg:text-base">
            Lorem ipsum dolor sit amet consectetur. Elit purus nam.
          </p>
        </div>

        <div className="mt-6 grid w-full max-w-[1186px] grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2 lg:items-stretch lg:justify-items-center">
          <div
            className={`${CARD_CLASS} bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]`}
          >
            <UserIcon />
            <h2 className="mt-4 text-[28px] font-bold leading-tight text-[#0070A4] sm:mt-6 sm:text-[36px]">
              User
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#0070A4] sm:mt-4 sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
            <div className="mt-auto w-full pt-10 sm:pt-14">
              <Link
                href="/login?role=user"
                className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-[#0070A4] text-sm font-medium text-white transition-colors hover:bg-[#005a85] sm:h-12"
              >
                Enter Workspace →
              </Link>
            </div>
          </div>

          <div className={`${CARD_CLASS} bg-[#0070A4]`}>
            <AdminIcon />
            <h2 className="mt-4 text-[28px] font-bold leading-tight text-white sm:mt-6 sm:text-[36px]">
              Administrator
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white sm:mt-4 sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
            <div className="mt-auto w-full pt-10 sm:pt-14">
              <Link
                href="/login?role=admin"
                className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-white text-sm font-medium text-[#0070A4] transition-colors hover:bg-[#F0F9FF] sm:h-12"
              >
                Enter Portal →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
