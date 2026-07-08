import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { Blog } from "@/lib/api/blogs";
import { resolveImageUrl } from "@/lib/api/image-url";
import BlogActions from "./BlogActions";

export default function BlogCard({
  blog,
  large = false,
  isAuthenticated = true,
  basePath = "/dashboard/blogs",
  userKey,
}: {
  blog: Blog;
  large?: boolean;
  isAuthenticated?: boolean;
  basePath?: string;
  userKey?: string;
}) {
  return (
    <article className={`overflow-hidden rounded-lg border border-white/10 bg-[#121718] shadow-xl shadow-black/20 ${large ? "lg:grid lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
      <div className={`relative ${large ? "min-h-[320px]" : "h-[205px]"}`}>
        <Link href={`${basePath}/${blog.slug}`} className="absolute inset-0 block overflow-hidden">
          <Image
            src={resolveImageUrl(blog.coverImage)}
            alt={blog.title}
            fill
            unoptimized
            className="object-cover transition duration-500 hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded bg-[#e9a127] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#121212]">
            {blog.category}
          </span>
        </Link>
        <div className="absolute right-4 top-4">
          <BlogActions
            slug={blog.slug}
            title={blog.title}
            compact
            isAuthenticated={isAuthenticated}
            basePath={basePath}
            userKey={userKey}
          />
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#9aa4a3]">
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={13} />
            {blog.authorName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} />
            {formatDate(blog.publishDate || blog.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} />
            {blog.readingTime}
          </span>
        </div>

        <Link href={`${basePath}/${blog.slug}`}>
          <h2 className={`mt-4 font-black leading-tight text-white transition hover:text-[#e9a127] ${large ? "text-3xl" : "text-xl"}`}>
            {blog.title}
          </h2>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#aeb5b4]">
          {blog.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
          <Link
            href={`${basePath}/${blog.slug}`}
            className="rounded-lg bg-[#e9a127] px-4 py-2.5 text-xs font-black text-[#121a18] transition hover:bg-[#f0b13d]"
          >
            Read blog
          </Link>
          <span className="text-xs font-bold text-slate-500">
            {blog.comments?.length || 0} comments
          </span>
        </div>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
