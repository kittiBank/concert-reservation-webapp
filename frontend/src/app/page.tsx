import Link from "next/link";

function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0070A4]">
        <span className="h-3 w-3 rounded-full bg-white" />
      </span>
      <span className="text-sm font-bold tracking-widest text-[#0070A4]">
        BRAND
      </span>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect
        x="8"
        y="10"
        width="32"
        height="28"
        rx="4"
        stroke="#0070A4"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="22" r="5" stroke="#0070A4" strokeWidth="1.5" />
      <path
        d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#0070A4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="1.5" />
      <path
        d="M10 36c0-5.523 4.477-10 10-10s10 4.477 10 10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="34" cy="34" r="7" stroke="white" strokeWidth="1.5" />
      <path
        d="M34 31v6M31 34h6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-roboto)]">
      <header className="shrink-0 border-b border-[#E5E7EB] bg-white px-6 py-4 sm:px-10">
        <BrandLogo />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-[#F5F5F5] px-4 py-10 sm:px-8">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-[#111827] sm:text-4xl">
            Select Access Level
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#9CA3AF]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-10 text-center shadow-sm">
            <UserIcon />
            <h2 className="mt-6 text-xl font-bold text-[#0070A4]">User</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#0070A4]/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
            <Link
              href="/login?role=user"
              className="mt-8 inline-flex h-11 w-full max-w-[220px] items-center justify-center rounded-md bg-[#0070A4] text-sm font-medium text-white transition-colors hover:bg-[#005a85]"
            >
              Enter Workspace →
            </Link>
          </div>

          <div className="flex flex-col items-center rounded-xl bg-[#0070A4] px-6 py-10 text-center shadow-sm">
            <AdminIcon />
            <h2 className="mt-6 text-xl font-bold text-white">Administrator</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
            <Link
              href="/login?role=admin"
              className="mt-8 inline-flex h-11 w-full max-w-[220px] items-center justify-center rounded-md bg-white text-sm font-medium text-[#0070A4] transition-colors hover:bg-[#F0F9FF]"
            >
              Enter Portal →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
