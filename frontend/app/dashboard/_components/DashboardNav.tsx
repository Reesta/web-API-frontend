"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Home, Hotel, Images, Map, User } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/dashboard/stay",
    label: "Stay",
    icon: Hotel,
  },
  {
    href: "/dashboard/trails",
    label: "Trails",
    icon: Map,
  },
  {
    href: "/dashboard/blogs",
    label: "Blogs",
    icon: BookOpenText,
  },
  {
    href: "/dashboard/moments",
    label: "Trek Moments",
    icon: Images,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="py-[18px] max-[1000px]:grid max-[1000px]:grid-cols-6 max-[1000px]:overflow-x-auto max-[1000px]:py-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "#";

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex h-[62px] items-center gap-[18px] border-l-[3px] px-7 text-sm font-semibold transition max-[1000px]:h-14 max-[1000px]:justify-center max-[1000px]:border-b-[3px] max-[1000px]:border-l-0 max-[1000px]:px-2.5 max-[1000px]:text-xs ${
              isActive
                ? "border-[#e0a12b] bg-[#e0a12b]/10 text-[#e0a12b] max-[1000px]:border-b-[#e0a12b]"
                : "border-transparent text-[#a9b5c4] hover:border-[#e0a12b] hover:bg-[#e0a12b]/10 hover:text-[#e0a12b]"
            }`}
          >
            <Icon size={17} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
