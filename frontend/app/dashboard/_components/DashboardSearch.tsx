"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { Stay } from "@/lib/api/stays";
import { Trail } from "@/lib/api/trails";

type SearchItem = {
  title: string;
  subtitle: string;
  href: string;
  category: "Trail" | "Stay" | "Popular";
};

type DashboardSearchProps = {
  trails: Trail[];
  stays: Stay[];
};

export default function DashboardSearch({ trails, stays }: DashboardSearchProps) {
  const [query, setQuery] = useState("");

  const items = useMemo<SearchItem[]>(() => {
    const trailItems = trails.map((trail) => ({
      title: trail.title,
      subtitle: `${trail.difficulty} trek - ${trail.duration}`,
      href: `/dashboard/trails/${trail.slug}`,
      category: "Trail" as const,
    }));

    const popularItems = trails.slice(0, 3).map((trail) => ({
      title: trail.title,
      subtitle: "Popular trek",
      href: `/dashboard/trails/${trail.slug}`,
      category: "Popular" as const,
    }));

    const stayItems = stays.map((stay) => ({
      title: stay.name,
      subtitle: `${stay.price} / night`,
      href: `/dashboard/stay/${stay.slug}`,
      category: "Stay" as const,
    }));

    return [...popularItems, ...trailItems, ...stayItems];
  }, [stays, trails]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items.slice(0, 6);
    }

    return items
      .filter((item) =>
        [item.title, item.subtitle, item.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
      .slice(0, 8);
  }, [items, query]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="relative w-full max-w-[390px]">
      <div className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-[#11191b] px-3 focus-within:border-[#e9a127]/60">
        <Search size={17} className="shrink-0 text-[#e9a127]" />
        <label className="sr-only" htmlFor="dashboard-search">
          Search trails and stays
        </label>
        <input
          id="dashboard-search"
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search trails, stays..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-[#7d8997]"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            title="Clear search"
            className="grid h-7 w-7 place-items-center rounded-md text-[#9aa8b8] transition hover:bg-white/5 hover:text-white"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {query ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full overflow-hidden rounded-lg border border-white/10 bg-[#07101b] shadow-2xl shadow-black/35">
          {results.length ? (
            results.map((item) => (
              <Link
                key={`${item.category}-${item.href}`}
                href={item.href}
                onClick={() => setQuery("")}
                className="block border-b border-white/5 px-4 py-3 transition last:border-b-0 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black text-white">{item.title}</p>
                  <span className="shrink-0 rounded-full bg-[#e9a127]/15 px-2 py-1 text-[10px] font-black uppercase text-[#e9a127]">
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-[#9aa8b8]">{item.subtitle}</p>
              </Link>
            ))
          ) : (
            <p className="px-4 py-4 text-sm text-[#9aa8b8]">No trails or stays found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
