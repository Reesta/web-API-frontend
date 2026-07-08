"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";

const navItems = [
  { label: "Explore", href: "/#explore", id: "explore" },
  { label: "Destinations", href: "/#destinations", id: "destinations" },
  { label: "Blogs", href: "/#blogs", id: "blogs" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Why Us", href: "/#why-us", id: "why-us" },
  { label: "Contact Us", href: "/#contact", id: "contact" },
];

export default function HomepageNav() {
  const [activeSection, setActiveSection] = useState("explore");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#070b13]/90 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 font-black text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D89A2B] text-black shadow-lg shadow-[#D89A2B]/20">
            <Mountain size={21} />
          </span>
          Yeti Trek
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-300 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveSection(item.id)}
                className={`relative pb-3 pt-3 transition ${
                  isActive ? "text-[#D89A2B]" : "hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#D89A2B] transition-all duration-300 ${
                    isActive ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#D89A2B] hover:text-[#D89A2B]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#D89A2B] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#D89A2B]/20 transition hover:bg-[#e7ad3e]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
