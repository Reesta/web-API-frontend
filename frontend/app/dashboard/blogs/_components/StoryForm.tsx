"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { submitStoryAction } from "@/lib/actions/blog-action";
import { Trail } from "@/lib/api/trails";

const inputClass =
  "mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#070d18] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70";
const textareaClass =
  "mt-2 min-h-32 w-full rounded-lg border border-white/10 bg-[#070d18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function StoryForm({ trails }: { trails: Trail[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setMessage("");

    const form = new FormData(formElement);
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const image = form.get("coverImage");
    const content = String(form.get("content") || "").trim();

    if (!title) {
      setError("Please add a story title.");
      return;
    }

    if (description.length < 2) {
      setError("Please add a short description.");
      return;
    }

    if (content.length < 10) {
      setError("Please write at least 10 characters in the trekking story.");
      return;
    }

    if (!(image instanceof File) || image.size === 0) {
      setError("Please upload a cover image for your story.");
      return;
    }

    form.set("slug", `${slugify(title)}-${Date.now()}`);
    form.set("category", "User Stories");
    form.set("readingTime", String(form.get("readingTime") || "4 min read"));
    form.set("relatedTrailSlugs", JSON.stringify([String(form.get("relatedTrailSlug") || "")].filter(Boolean)));

    startTransition(async () => {
      const result = await submitStoryAction(form);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setMessage("Story submitted. Admin approval is required before publication.");
      formElement.reset();
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-white/10 bg-[#121718] p-5 shadow-xl shadow-black/20">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-black text-white">
          Story title
          <input name="title" className={inputClass} placeholder="My first trek to Mardi Himal" />
        </label>
        <label className="text-sm font-black text-white">
          Reading time
          <input name="readingTime" className={inputClass} placeholder="5 min read" />
        </label>
        <label className="text-sm font-black text-white">
          Related trek
          <select name="relatedTrailSlug" className={inputClass} defaultValue="">
            <option value="">Choose a trek</option>
            {trails.map((trail) => (
              <option key={trail.slug} value={trail.slug}>
                {trail.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-black text-white">
          Cover image
          <input name="coverImage" type="file" accept="image/*" className={`${inputClass} py-3`} />
        </label>
      </div>

      <label className="mt-5 block text-sm font-black text-white">
        Short description
        <textarea name="description" className={textareaClass} placeholder="Tell readers what your story is about." />
      </label>

      <label className="mt-5 block text-sm font-black text-white">
        Trekking story
        <textarea name="content" className="mt-2 min-h-64 w-full rounded-lg border border-white/10 bg-[#070d18] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70" placeholder="Write your story with tips, lessons, and memorable moments." />
      </label>

      {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
      {message && <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}

      <button
        disabled={isPending}
        className="mt-5 inline-flex h-12 items-center gap-2 rounded-lg bg-[#e9a127] px-5 text-sm font-black text-[#121a18] disabled:opacity-60"
      >
        <Send size={16} />
        {isPending ? "Submitting..." : "Submit story"}
      </button>
    </form>
  );
}
