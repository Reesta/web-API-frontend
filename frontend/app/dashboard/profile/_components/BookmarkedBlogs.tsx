"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, CalendarDays } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Blog } from "@/lib/api/blogs";
import { resolveImageUrl } from "@/lib/api/image-url";
import { bookmarkStorageKey } from "../../blogs/_components/BlogActions";

export default function BookmarkedBlogs({
  blogs,
  userKey,
}: {
  blogs: Blog[];
  userKey: string;
}) {
  const bookmarkedBlogs = useBookmarkedBlogs(blogs, userKey);

  return (
    <section className="overflow-hidden rounded-[14px] border border-[#e0a12b]/35 bg-[linear-gradient(135deg,#101820,#252827)] p-6 shadow-xl shadow-black/25">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-[#e0a12b] text-[#111]">
          <Bookmark size={18} />
        </span>
        <div>
          <p className="text-2xl font-black text-white">Bookmarked Blogs</p>
          <span className="mt-1.5 block text-sm text-[#aeb8c3]">
            Saved articles from the Yeti Trek journal.
          </span>
        </div>
        </div>
        <Link
          href="/dashboard/blogs"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#e0a12b]/35 px-4 text-sm font-black text-[#e0a12b] transition hover:bg-[#e0a12b]/10"
        >
          Browse blogs
        </Link>
      </div>

      {bookmarkedBlogs.length ? (
        <div className="grid gap-3">
          {bookmarkedBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/dashboard/blogs/${blog.slug}`}
              className="group grid grid-cols-[82px_minmax(0,1fr)] gap-4 rounded-lg border border-white/10 bg-[#101820] p-3 transition hover:border-[#e0a12b]/60 hover:bg-[#131d26]"
            >
              <span className="relative h-[72px] overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={resolveImageUrl(blog.coverImage)}
                  alt={blog.title}
                  fill
                  unoptimized
                  className="object-cover transition group-hover:scale-105"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-white">
                  {blog.title}
                </span>
                <span className="mt-1 line-clamp-2 text-xs leading-5 text-[#aeb8c3]">
                  {blog.description}
                </span>
                <span className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#e0a12b]">
                  <CalendarDays size={12} />
                  {formatDate(blog.publishDate || blog.createdAt)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-[#101820] p-5 text-sm leading-6 text-[#aeb8c3]">
          You have not bookmarked any blogs yet. Open a blog and press
          Bookmark to save it here.
        </div>
      )}
    </section>
  );
}

function useBookmarkedBlogs(blogs: Blog[], userKey: string) {
  const bookmarkedSlugs = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const events = blogs.map((blog) => storageEventName(bookmarkStorageKey(blog.slug, userKey)));
      const onStorage = (event: StorageEvent) => {
        if (event.key?.startsWith(`yeti-blog-bookmark-${userKey}-`)) {
          onStoreChange();
        }
      };

      window.addEventListener("storage", onStorage);
      events.forEach((eventName) => window.addEventListener(eventName, onStoreChange));

      return () => {
        window.removeEventListener("storage", onStorage);
        events.forEach((eventName) => window.removeEventListener(eventName, onStoreChange));
      };
    },
    () =>
      blogs
        .filter((blog) => localStorage.getItem(bookmarkStorageKey(blog.slug, userKey)) === "yes")
        .map((blog) => blog.slug)
        .join("|"),
    () => "",
  );

  const bookmarkedSlugSet = new Set(bookmarkedSlugs.split("|").filter(Boolean));
  return blogs.filter((blog) => bookmarkedSlugSet.has(blog.slug));
}

function storageEventName(key: string) {
  return `yeti-storage:${key}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
