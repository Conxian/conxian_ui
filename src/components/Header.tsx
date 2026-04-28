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
  { name: "Execute", href: "/swap" },
  { name: "Reserves", href: "/pools" },
  { name: "Bootstrap", href: "/launch" },
  { name: "Portfolio", href: "/positions" },
  { name: "Forge", href: "/tx" },
  { name: "Telemetry", href: "/network" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-accent/20 bg-ink-deep">
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between p-4 lg:px-12" aria-label="Global">
        <div className="flex lg:flex-1 items-center gap-x-12">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/conxian-mark-b.svg"
                alt="Conxian"
                width={28}
                height={28}
                className="h-7 w-7 transition-transform duration-500 group-hover:rotate-180"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-[-0.05em] text-white">
              CONXIAN<span className="text-accent">_</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] leading-6 transition-all duration-300",
                    isActive
                      ? "text-accent"
                      : "text-white/40 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-x-6">
          <div className="hidden sm:flex items-center rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white/50">
             {AppConfig.network.toUpperCase()}
          </div>
          <ConnectWallet />
          
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              className="-m-2.5 p-2.5 text-white/80 hover:text-white"
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
        <div className="lg:hidden border-t border-white/10 bg-ink-deep">
          <div className="space-y-1 px-6 pb-6 pt-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-xs font-black uppercase tracking-widest",
                    isActive
                      ? "text-accent"
                      : "text-white/60 hover:text-white"
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
