"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteAdminBlogAction } from "@/lib/actions/admin/admin-blog-action";
import { AdminBlog, BlogListMeta } from "@/lib/api/admin/admin-blogs";
import { resolveImageUrl } from "@/lib/api/image-url";

export default function BlogTable({
  data,
  meta,
  search,
  status,
}: {
  data: AdminBlog[];
  meta: BlogListMeta;
  search: string;
  status: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [target, setTarget] = useState<AdminBlog | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const firstRow = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const lastRow = Math.min(meta.page * meta.limit, meta.total);

  const setQuery = (next: Record<string, string | number>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === "") query.delete(key);
      else query.set(key, String(value));
    });
    router.push(`/admin/blogs?${query.toString()}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery({
      search: String(new FormData(event.currentTarget).get("search") || ""),
      page: 1,
    });
  };

  const removeBlog = () => {
    if (!target) return;
    setError("");

    startTransition(async () => {
      const result = await deleteAdminBlogAction(target.id);
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
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Blog Management</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Create, publish, feature, approve, and remove Yeti Trek journal posts.
              </p>
            </div>
            <Link href="/admin/blogs/create" className="inline-flex items-center justify-center rounded-2xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a]">
              + Create blog
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
        <form onSubmit={onSearch} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_auto_auto]">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by title, author, category..."
            className="h-12 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#e9a127]/70"
          />
          <select
            value={status}
            onChange={(event) => setQuery({ status: event.target.value, page: 1 })}
            className="h-12 rounded-2xl border border-white/10 bg-[#0d1422] px-4 text-sm font-bold text-white outline-none"
          >
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
          <button className="h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-6 text-sm font-black text-slate-100">
            Search
          </button>
          {(search || status) && (
            <button type="button" onClick={() => setQuery({ search: "", status: "", page: 1 })} className="h-12 rounded-2xl border border-white/10 px-4 text-sm font-bold text-slate-300">
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
                  <th className="px-5 py-4">Blog</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Flags</th>
                  <th className="px-5 py-4">Author</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.length ? data.map((blog) => (
                  <tr key={blog.id} className="transition hover:bg-white/[0.035]">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                          {blog.coverImage ? (
                            <Image src={resolveImageUrl(blog.coverImage)} alt={blog.title} fill unoptimized className="object-cover" />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-black text-white">{blog.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{blog.category} - {blog.readingTime}</p>
                          <p className="mt-2 line-clamp-1 max-w-md text-xs text-slate-400">{blog.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={statusClass(blog.status)}>{blog.status}</span>
                    </td>
                    <td className="px-5 py-5 text-xs font-bold text-slate-300">
                      <div className="flex flex-wrap gap-2">
                        {blog.featured && <span className="rounded-full bg-[#e9a127]/15 px-2 py-1 text-[#e9a127]">Featured</span>}
                        {blog.popular && <span className="rounded-full bg-sky-400/15 px-2 py-1 text-sky-200">Popular</span>}
                        {blog.source === "user" && <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-200">Story</span>}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-300">{blog.authorName}</td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {blog.status === "published" && (
                          <Link href={`/dashboard/blogs/${blog.slug}`} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300">View</Link>
                        )}
                        <Link href={`/admin/blogs/${blog.id}/edit`} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300">Edit</Link>
                        <button onClick={() => setTarget(blog)} className="rounded-xl border border-red-300/20 px-3 py-2 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-slate-400">No blogs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Showing <strong className="text-slate-200">{firstRow}</strong>-<strong className="text-slate-200">{lastRow}</strong> of <strong className="text-slate-200">{meta.total}</strong> blogs</span>
          <div className="flex items-center gap-2">
            <button disabled={meta.page <= 1} onClick={() => setQuery({ page: meta.page - 1 })} className="rounded-2xl border border-white/10 px-4 py-2.5 font-bold text-slate-200 disabled:opacity-40">Previous</button>
            <span className="rounded-2xl bg-white/[0.06] px-4 py-2.5 font-black text-white">{meta.page} / {Math.max(meta.totalPages, 1)}</span>
            <button disabled={meta.page >= meta.totalPages} onClick={() => setQuery({ page: meta.page + 1 })} className="rounded-2xl border border-white/10 px-4 py-2.5 font-bold text-slate-200 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      {target && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1422] p-6 shadow-2xl shadow-black">
            <h2 className="text-2xl font-black text-white">Delete this blog?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">You are about to delete <strong className="text-white">{target.title}</strong>.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setTarget(null)} className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200">Cancel</button>
              <button onClick={removeBlog} disabled={isPending} className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60">
                {isPending ? "Deleting..." : "Delete blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function statusClass(status: AdminBlog["status"]) {
  if (status === "published") {
    return "rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-200";
  }
  if (status === "pending") {
    return "rounded-full border border-[#e9a127]/30 bg-[#e9a127]/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#e9a127]";
  }
  return "rounded-full border border-slate-300/20 bg-slate-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-200";
}
