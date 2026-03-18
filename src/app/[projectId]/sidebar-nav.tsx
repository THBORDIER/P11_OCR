"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export default function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 py-4">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
              isActive
                ? "bg-[#334155] text-white border-r-2 border-[#3b82f6]"
                : "hover:bg-[#334155]"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
