"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import {
  deleteAdminReviewAction,
  updateAdminReviewAction,
} from "@/lib/actions/admin/admin-review-action";
import { AdminReview, ReviewListMeta } from "@/lib/api/admin/admin-reviews";

export default function ReviewTable({
  data,
  meta,
  search,
}: {
  data: AdminReview[];
  meta: ReviewListMeta;
  search: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const setQuery = (next: Record<string, string | number>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => query.set(key, String(value)));
    router.push(`/admin/reviews?${query.toString()}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery({
      search: String(new FormData(event.currentTarget).get("search") || ""),
      page: 1,
    });
  };

  const saveReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const formData = new FormData(event.currentTarget);
    setError("");

    startTransition(async () => {
      const result = await updateAdminReviewAction(editing.id, editing.staySlug, {
        rating: Number(formData.get("rating")),
        title: String(formData.get("title") || ""),
        text: String(formData.get("text") || ""),
        helpfulCount: Number(formData.get("helpfulCount")),
      });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  };

  const removeReview = (review: AdminReview) => {
    setError("");
    startTransition(async () => {
      const result = await deleteAdminReviewAction(review.id, review.staySlug);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#e9a127]">
              Admin workspace
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Review Moderation
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              View, edit, or remove stay reviews that need attention.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-100"
          >
            Admin dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 sm:p-5">
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search stay slug, title, or review text..."
            className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#e9a127]/70"
          />
          <button className="h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-6 text-sm font-black text-slate-100">
            Search
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08101c]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Review</th>
                  <th className="px-5 py-4">Stay</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Helpful</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.length ? (
                  data.map((review) => (
                    <tr key={review.id} className="transition hover:bg-white/[0.035]">
                      <td className="max-w-md px-5 py-5">
                        <p className="font-black text-white">{review.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                          {review.text}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">By {review.userName}</p>
                      </td>
                      <td className="px-5 py-5 text-slate-300">{review.staySlug}</td>
                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-1 font-black text-[#e9a127]">
                          <Star size={15} fill="currentColor" />
                          {review.rating}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-slate-300">{review.helpfulCount}</td>
                      <td className="px-5 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/stay/${review.staySlug}`}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => setEditing(review)}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeReview(review)}
                            disabled={isPending}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-300/20 px-3 py-2 text-xs font-bold text-red-200 disabled:opacity-60"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-slate-400">
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {meta.page} of {meta.totalPages} · {meta.total} reviews
          </span>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setQuery({ page: meta.page - 1 })}
              className="rounded-xl border border-white/10 px-3 py-2 font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setQuery({ page: meta.page + 1 })}
              className="rounded-xl border border-white/10 px-3 py-2 font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveReview}
            className="grid w-full max-w-xl gap-4 rounded-[2rem] border border-white/10 bg-[#0d1422] p-6 shadow-2xl shadow-black"
          >
            <h2 className="text-2xl font-black text-white">Edit review</h2>
            <input
              name="title"
              defaultValue={editing.title}
              className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none"
            />
            <textarea
              name="text"
              defaultValue={editing.text}
              rows={5}
              className="resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white outline-none"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Rating
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={editing.rating}
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none"
                />
              </label>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Helpful count
                <input
                  name="helpfulCount"
                  type="number"
                  min={0}
                  defaultValue={editing.helpfulCount}
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                className="rounded-xl bg-[#e9a127] px-4 py-2.5 text-sm font-black text-[#17120a] disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
