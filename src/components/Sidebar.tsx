
"use client";
import {
  CreditCardIcon,
  HomeIcon,
  ShieldCheckIcon,
  PlusCircleIcon,
  ArrowsUpDownIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ⚡ Bolt: Define navigation data outside the component.
// This prevents the array from being recreated on every render, which is more memory-efficient.
const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Swap", href: "/swap", icon: ArrowsUpDownIcon },
  { name: "Launch", href: "/launch", icon: RocketLaunchIcon },
  { name: "Add Liquidity", href: "/add-liquidity", icon: PlusCircleIcon },
  { name: "My Positions", href: "/positions", icon: CreditCardIcon },
  { name: "Shielded Wallets", href: "/shielded", icon: ShieldCheckIcon },
  { name: "System Overview", href: "/overview", icon: RocketLaunchIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 bg-primary-dark border-r border-accent/20">
      <div className="flex items-center h-16 px-6 bg-primary-dark border-b border-accent/20">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/conxian-mark-b.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="text-lg font-semibold tracking-wide text-primary-foreground">
            CONXIAN
          </span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-accent/20 text-primary-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-accent/20"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-6 w-6",
                  pathname === item.href
                    ? "text-primary-foreground"
                    : "text-primary-foreground/60 group-hover:text-primary-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
