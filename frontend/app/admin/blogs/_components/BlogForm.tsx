"use client";

import Image from "next/image";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Save } from "lucide-react";
import {
  createAdminBlogFormAction,
  updateAdminBlogFormAction,
} from "@/lib/actions/admin/admin-blog-action";
import { AdminBlog } from "@/lib/api/admin/admin-blogs";
import { BlogStatus, blogCategories } from "@/lib/api/blogs";
import { resolveImageUrl } from "@/lib/api/image-url";
import { Trail } from "@/lib/api/trails";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70";
const textareaClass =
  "mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function BlogForm({
  blog,
  trails,
}: {
  blog?: AdminBlog;
  trails: Trail[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(blog);
  const previewUrl = preview || resolveImageUrl(blog?.coverImage);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const content = String(form.get("content") || "").trim();
    const image = form.get("coverImage");
    const hasImage = image instanceof File && image.size > 0;
    const selectedTrails = form.getAll("relatedTrailSlugs").map(String).filter(Boolean);
    const status = String(form.get("status") || "draft") as BlogStatus;

    form.set("slug", blog?.slug || slugify(title));
    form.set("relatedTrailSlugs", JSON.stringify(selectedTrails));
    form.set("featured", form.get("featured") === "on" ? "true" : "false");
    form.set("popular", form.get("popular") === "on" ? "true" : "false");
    form.set("source", blog?.source || "admin");
    if (status === "published" && !form.get("publishDate")) {
      form.set("publishDate", new Date().toISOString());
    }

    if (!title || content.length < 20 || !form.get("description")) {
      setError("Title, description, and rich content are required.");
      return;
    }
    if (!isEditing && !hasImage) {
      setError("Please upload a cover image.");
      return;
    }
    if (!hasImage) {
      form.delete("coverImage");
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateAdminBlogFormAction(blog!.id, form)
        : await createAdminBlogFormAction(form);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/admin/blogs");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1422]/95 shadow-2xl shadow-black/30">
      <div className="grid gap-0 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border-b border-white/10 bg-[#08101c] p-5 xl:border-b-0 xl:border-r sm:p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e9a127]">Blog media</p>
          <h2 className="mt-2 text-xl font-black text-white">Cover image</h2>
          <label className="group relative mt-5 flex min-h-[340px] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.04]">
            {previewUrl ? (
              <Image src={previewUrl} alt={blog?.title || "Blog cover"} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
            ) : (
              <span className="grid flex-1 place-items-center text-center text-slate-400">
                <span>
                  <ImagePlus className="mx-auto text-[#e9a127]" size={32} />
                  <span className="mt-3 block text-sm font-black text-white">Upload cover image</span>
                </span>
              </span>
            )}
            <input
              name="coverImage"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : "");
              }}
            />
            <span className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-2 text-xs font-black text-white backdrop-blur">
              {previewUrl ? "Change image" : "Choose image"}
            </span>
          </label>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <h2 className="text-lg font-black text-white">Blog details</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-black text-slate-200">
                Title
                <input name="title" defaultValue={blog?.title || ""} className={inputClass} required />
              </label>
              <label className="block text-sm font-black text-slate-200">
                Author
                <input name="authorName" defaultValue={blog?.authorName || ""} className={inputClass} required />
              </label>
              <label className="block text-sm font-black text-slate-200">
                Category
                <select name="category" defaultValue={blog?.category || "Trek Guides"} className={inputClass}>
                  {blogCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-black text-slate-200">
                Reading time
                <input name="readingTime" defaultValue={blog?.readingTime || "5 min read"} className={inputClass} required />
              </label>
              <label className="block text-sm font-black text-slate-200">
                Status
                <select name="status" defaultValue={blog?.status || "draft"} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="block text-sm font-black text-slate-200">
                Publish date
                <input name="publishDate" type="date" defaultValue={blog?.publishDate ? blog.publishDate.slice(0, 10) : ""} className={inputClass} />
              </label>
            </div>

            <label className="mt-5 block text-sm font-black text-slate-200">
              Short description
              <textarea name="description" defaultValue={blog?.description || ""} className={textareaClass} required />
            </label>

            <label className="mt-5 block text-sm font-black text-slate-200">
              Rich content
              <textarea name="content" defaultValue={blog?.content || ""} className="mt-2 min-h-72 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 py-3 text-sm font-semibold leading-7 text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70" required />
            </label>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <h2 className="text-lg font-black text-white">Publishing controls</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#08101c] p-4 text-sm font-black text-white">
                <input name="featured" type="checkbox" defaultChecked={blog?.featured || false} className="h-4 w-4 accent-[#e9a127]" />
                Feature this blog
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#08101c] p-4 text-sm font-black text-white">
                <input name="popular" type="checkbox" defaultChecked={blog?.popular || false} className="h-4 w-4 accent-[#e9a127]" />
                Mark as popular
              </label>
            </div>

            <label className="mt-5 block text-sm font-black text-slate-200">
              Related trek recommendations
              <select name="relatedTrailSlugs" multiple defaultValue={blog?.relatedTrailSlugs || []} className="mt-2 min-h-36 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-[#e9a127]/70">
                {trails.map((trail) => (
                  <option key={trail.slug} value={trail.slug}>{trail.title}</option>
                ))}
              </select>
            </label>
          </section>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => router.back()} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200">
              Cancel
            </button>
            <button disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] disabled:opacity-60">
              <Save size={16} />
              {isPending ? "Saving..." : isEditing ? "Save changes" : "Create blog"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
