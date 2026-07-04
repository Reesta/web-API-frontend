"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteAdminTrailAction } from "@/lib/actions/admin/admin-trail-action";
import { AdminTrail, TrailListMeta } from "@/lib/api/admin/admin-trails";
import { resolveImageUrl } from "@/lib/api/image-url";

export default function TrailTable({
  data,
  meta,
  search,
}: {
  data: AdminTrail[];
  meta: TrailListMeta;
  search: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [target, setTarget] = useState<AdminTrail | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const firstRow = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const lastRow = Math.min(meta.page * meta.limit, meta.total);

  const setQuery = (next: Record<string, string | number>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => query.set(key, String(value)));
    router.push(`/admin/trails?${query.toString()}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery({
      search: String(new FormData(event.currentTarget).get("search") || ""),
      page: 1,
    });
  };

  const removeTrail = () => {
    if (!target) return;
    setError("");

    startTransition(async () => {
      const result = await deleteAdminTrailAction(target.id);
      if (!result.success) {
        setError(result.message);
        return;
      }

      setTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#e9a127]">Admin workspace</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Trail Management</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Add, update, and remove trekking routes shown in the user dashboard.
              </p>
            </div>
            <Link href="/admin/trails/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:-translate-y-0.5 hover:bg-[#f5b94d]">
              + Create trail
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by title or difficulty..."
            className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#e9a127]/70"
          />
          <button className="h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-6 text-sm font-black text-slate-100 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => setQuery({ search: "", page: 1 })} className="h-12 rounded-2xl border border-white/10 px-4 text-sm font-bold text-slate-300">
              Clear
            </button>
          )}
        </form>

        {error && <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08101c]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Trail</th>
                  <th className="px-5 py-4">Difficulty</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Distance</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.length ? data.map((trail) => (
                  <tr key={trail.id} className="transition hover:bg-white/[0.035]">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                          {trail.image ? (
                            <Image
                              src={resolveImageUrl(trail.image)}
                              alt={trail.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-black text-white">{trail.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {trail.altitude} - {trail.distance}
                          </p>
                          <p className="mt-2 line-clamp-1 max-w-md text-xs text-slate-400">{trail.text}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={difficultyClass(trail.difficulty)}>
                        {trail.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-slate-300">{trail.duration}</td>
                    <td className="px-5 py-5 text-slate-300">{trail.distance}</td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/trails/${trail.slug}`} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200">View</Link>
                        <Link href={`/admin/trails/${trail.id}/edit`} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]">Edit</Link>
                        <button onClick={() => setTarget(trail)} className="rounded-xl border border-red-300/20 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-500/15">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-slate-400">No trails found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Showing <strong className="text-slate-200">{firstRow}</strong>-<strong className="text-slate-200">{lastRow}</strong> of <strong className="text-slate-200">{meta.total}</strong> trails</span>
          <div className="flex items-center gap-2">
            <button disabled={meta.page <= 1} onClick={() => setQuery({ page: meta.page - 1 })} className="rounded-2xl border border-white/10 px-4 py-2.5 font-bold text-slate-200 transition hover:border-[#e9a127]/50 disabled:opacity-40">Previous</button>
            <span className="rounded-2xl bg-white/[0.06] px-4 py-2.5 font-black text-white">{meta.page} / {Math.max(meta.totalPages, 1)}</span>
            <button disabled={meta.page >= meta.totalPages} onClick={() => setQuery({ page: meta.page + 1 })} className="rounded-2xl border border-white/10 px-4 py-2.5 font-bold text-slate-200 transition hover:border-[#e9a127]/50 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      {target && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1422] p-6 shadow-2xl shadow-black">
            <h2 className="text-2xl font-black text-white">Delete this trail?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">You are about to delete <strong className="text-white">{target.title}</strong>.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setTarget(null)} className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200">Cancel</button>
              <button onClick={removeTrail} disabled={isPending} className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-400 disabled:opacity-60">
                {isPending ? "Deleting..." : "Delete trail"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function difficultyClass(difficulty: AdminTrail["difficulty"]) {
  if (difficulty === "Hard") {
    return "rounded-full border border-red-300/25 bg-red-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-200";
  }

  if (difficulty === "Mod") {
    return "rounded-full border border-[#e9a127]/30 bg-[#e9a127]/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#e9a127]";
  }

  return "rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-200";
}
