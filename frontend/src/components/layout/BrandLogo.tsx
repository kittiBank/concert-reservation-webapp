interface BrandLogoProps {
  variant?: "light" | "dark";
}

export function BrandLogo({ variant = "light" }: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-6 w-6 shrink-0 rounded-full ${
          isLight ? "bg-[#0070A4]" : "bg-white"
        }`}
      />
      <span
        className={`text-right font-[family-name:var(--font-roboto)] text-[24px] font-semibold leading-[150%] tracking-normal ${
          isLight ? "text-[#0070A4]" : "text-white"
        }`}
      >
        BRAND
      </span>
    </div>
  );
}
