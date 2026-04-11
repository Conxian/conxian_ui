"use client";

import ConnectWallet from "@/components/ConnectWallet";
import { AppConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navigation = [
  { name: "Swap", href: "/swap" },
  { name: "Pools", href: "/pools" },
  { name: "Launch", href: "/launch" },
  { name: "Portfolio", href: "/positions" },
  { name: "Shielded", href: "/shielded" },
  { name: "Overview", href: "/overview" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-primary-dark">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1 items-center gap-x-8">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <span className="sr-only">Conxian</span>
            <Image
              src="/conxian-mark-b.svg"
              alt="Conxian"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-xl font-bold tracking-wide text-primary-foreground hidden sm:block">
              CONXIAN
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider leading-6 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-x-4">
          <div className="hidden sm:flex items-center rounded-full border border-accent/20 bg-primary-dark px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
            {AppConfig.network.toUpperCase()}
          </div>
          <ConnectWallet />
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              className="-m-2.5 p-2.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-accent/20 bg-primary-dark">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive
                      ? "bg-accent/20 text-primary-foreground"
                      : "text-primary-foreground/60 hover:bg-accent/10 hover:text-primary-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
