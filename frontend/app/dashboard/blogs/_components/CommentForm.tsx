"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { addBlogCommentAction } from "@/lib/actions/blog-action";

export default function CommentForm({ slug }: { slug: string }) {
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
    const text = String(form.get("text") || "").trim();

    if (text.length < 2) {
      setError("Please write a comment first.");
      return;
    }

    startTransition(async () => {
      const result = await addBlogCommentAction(slug, { text });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setMessage("Comment added.");
      formElement.reset();
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-white/10 bg-[#121718] p-5">
      <label className="block text-sm font-black text-white">
        Add a comment
        <textarea
          name="text"
          className="mt-3 min-h-28 w-full rounded-lg border border-white/10 bg-[#070d18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#e9a127]/70"
          placeholder="Share your trekking thought..."
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-200">{message}</p>}
      <button
        disabled={isPending}
        className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[#e9a127] px-5 text-sm font-black text-[#121a18] disabled:opacity-60"
      >
        <MessageSquarePlus size={16} />
        {isPending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
