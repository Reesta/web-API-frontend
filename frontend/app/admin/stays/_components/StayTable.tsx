"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteAdminStayAction } from "@/lib/actions/admin/admin-stay-action";
import { AdminStay, StayListMeta } from "@/lib/api/admin/admin-stays";
import { resolveImageUrl } from "@/lib/api/image-url";

export default function StayTable({ data, search }: { data: AdminStay[]; meta: StayListMeta; search: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [target, setTarget] = useState<AdminStay | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const setQuery = (next: Record<string, string | number>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => query.set(key, String(value)));
    router.push(`/admin/stays?${query.toString()}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery({ search: String(new FormData(event.currentTarget).get("search") || ""), page: 1 });
  };

  const removeStay = () => {
    if (!target) return;
    setError("");
    startTransition(async () => {
      const result = await deleteAdminStayAction(target.id);
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
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#e9a127]">Admin workspace</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Stay Management</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Add, update, and remove lodges shown in the user dashboard.</p>
          </div>
          <Link href="/admin/stays/create" className="inline-flex items-center justify-center rounded-2xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a]">+ Create stay</Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 sm:p-5">
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
          <input name="search" defaultValue={search} placeholder="Search by name or location..." className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#e9a127]/70" />
          <button className="h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-6 text-sm font-black text-slate-100">Search</button>
        </form>
        {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08101c]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr><th className="px-5 py-4">Stay</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Amenities</th><th className="px-5 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.length ? data.map((stay) => (
                  <tr key={stay.id} className="transition hover:bg-white/[0.035]">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                          <Image src={resolveImageUrl(stay.image)} alt={stay.name} fill unoptimized className="object-cover" />
                        </div>
                        <div><p className="font-black text-white">{stay.name}</p><p className="mt-1 text-xs text-slate-500">{stay.distance}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-5 font-black text-[#e9a127]">{stay.price}</td>
                    <td className="px-5 py-5 text-slate-300">{stay.amenities.slice(0, 3).join(", ")}</td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/stay/${stay.slug}`} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300">View</Link>
                        <Link href={`/admin/stays/${stay.id}/edit`} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300">Edit</Link>
                        <button onClick={() => setTarget(stay)} className="rounded-xl border border-red-300/20 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4} className="px-5 py-16 text-center text-slate-400">No stays found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {target && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1422] p-6 shadow-2xl shadow-black">
            <h2 className="text-2xl font-black text-white">Delete this stay?</h2>
            <p className="mt-3 text-sm text-slate-300">You are about to delete <strong className="text-white">{target.name}</strong>.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setTarget(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200">Cancel</button>
              <button onClick={removeStay} disabled={isPending} className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60">{isPending ? "Deleting..." : "Delete stay"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
