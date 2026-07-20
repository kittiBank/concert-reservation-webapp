"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const authPaths = ["/", "/login", "/register"];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (authPaths.includes(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/concerts", label: "Concerts", show: isAuthenticated && !isAdmin },
    {
      href: "/my-reservations",
      label: "My Reservations",
      show: isAuthenticated && !isAdmin,
    },
  ];

  const isPublicOnly = authPaths.includes(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg text-white">
            ♪
          </span>
          <span className="text-lg font-bold text-surface-900">
            Concert<span className="text-brand-600">Reserve</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-surface-600 sm:block">
                {user?.email}
                {isAdmin && (
                  <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-xs font-medium text-brand-700">
                    ADMIN
                  </span>
                )}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            !isPublicOnly && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="flex gap-1 overflow-x-auto border-t border-surface-100 px-4 py-2 md:hidden">
          {navLinks
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  pathname.startsWith(link.href)
                    ? "bg-brand-600 text-white"
                    : "bg-surface-100 text-surface-700",
                )}
              >
                {link.label}
              </Link>
            ))}
        </div>
      )}
    </header>
  );
}
