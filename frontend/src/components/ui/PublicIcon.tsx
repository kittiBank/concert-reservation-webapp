import Image from "next/image";
import { cn } from "@/lib/utils";

interface PublicIconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function PublicIcon({
  src,
  alt = "",
  size = 20,
  className,
}: PublicIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
