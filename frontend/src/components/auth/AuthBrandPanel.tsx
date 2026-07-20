export function AuthBrandPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between bg-[#0070A4] p-10 lg:flex">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
          <span className="h-3 w-3 rounded-full bg-white" />
        </span>
        <span className="text-sm font-medium tracking-widest text-white">
          BRAND
        </span>
      </div>

      <div className="max-w-md">
        <blockquote className="text-3xl font-normal leading-snug text-white">
          &ldquo;Powering the tools that power the team.&rdquo;
        </blockquote>
        <p className="mt-6 text-sm leading-relaxed text-white/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      </div>
    </div>
  );
}
