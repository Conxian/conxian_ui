"use client";

import ConnectWallet from "@/components/ConnectWallet";
import { AppConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

function titleFromPathname(pathname: string): string {
  if (!pathname || pathname === "/") return "Dashboard";

  const seg = pathname
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean)[0];

  if (!seg) return "Dashboard";

  return seg
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Header() {
  const pathname = usePathname();
  // ⚡ Bolt: Memoize the title calculation.
  // This prevents the title from being recalculated on every render,
  // only when the pathname changes.
  const title = useMemo(() => titleFromPathname(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-accent/20 bg-primary-dark px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="lg:hidden">
            <Image
              src="/conxian-mark-b.svg"
              alt="Conxian"
              width={24}
              height={24}
              className="h-6 w-6"
              priority
            />
          </Link>
          <h1 className="text-sm sm:text-base font-semibold text-primary-foreground">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center rounded-full border border-accent/20 bg-primary-dark px-2.5 py-1 text-xs font-medium text-primary-foreground/80">
            {AppConfig.network.toUpperCase()}
          </div>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
