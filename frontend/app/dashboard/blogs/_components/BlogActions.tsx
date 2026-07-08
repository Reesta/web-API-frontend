"use client";

import { Bookmark, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

export default function BlogActions({
  slug,
  title,
  compact = false,
  isAuthenticated = true,
  basePath = "/dashboard/blogs",
  userKey,
}: {
  slug: string;
  title: string;
  compact?: boolean;
  isAuthenticated?: boolean;
  basePath?: string;
  userKey?: string;
}) {
  const router = useRouter();
  const storageKey = bookmarkStorageKey(slug, userKey);
  const likeKey = `yeti-blog-like-${userKey || "guest"}-${slug}`;
  const bookmarked = useStoredFlag(storageKey);
  const liked = useStoredFlag(likeKey);

  const requireLogin = () => {
    router.push(`/login?next=${encodeURIComponent(`${basePath}/${slug}`)}`);
  };

  const toggleBookmark = () => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    const next = !bookmarked;
    setStoredFlag(storageKey, next);
  };

  const toggleLike = () => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    const next = !liked;
    setStoredFlag(likeKey, next);
  };

  const shareBlog = async () => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    const url = `${window.location.origin}${basePath}/${slug}`;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  const buttonClass = compact
    ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/25 text-white transition hover:border-[#e9a127]/50 hover:text-[#e9a127]"
    : "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleBookmark}
        className={`${buttonClass} ${bookmarked ? "border-[#e9a127]/60 text-[#e9a127]" : ""}`}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark blog"}
      >
        <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
        {!compact && <span>{bookmarked ? "Saved" : "Bookmark"}</span>}
      </button>
      <button
        type="button"
        onClick={toggleLike}
        className={`${buttonClass} ${liked ? "border-red-300/60 text-red-200" : ""}`}
        aria-label={liked ? "Unlike blog" : "Like blog"}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
        {!compact && <span>{liked ? "Liked" : "Like"}</span>}
      </button>
      <button type="button" onClick={shareBlog} className={buttonClass} aria-label="Share blog">
        <Share2 size={16} />
        {!compact && <span>Share</span>}
      </button>
    </div>
  );
}

function useStoredFlag(key: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const customEventName = storageEventName(key);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) {
          onStoreChange();
        }
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener(customEventName, onStoreChange);

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(customEventName, onStoreChange);
      };
    },
    () => typeof window !== "undefined" && localStorage.getItem(key) === "yes",
    () => false,
  );
}

function setStoredFlag(key: string, value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    localStorage.setItem(key, "yes");
  } else {
    localStorage.removeItem(key);
  }

  window.dispatchEvent(new Event(storageEventName(key)));
}

function storageEventName(key: string) {
  return `yeti-storage:${key}`;
}

export function bookmarkStorageKey(slug: string, userKey?: string) {
  return `yeti-blog-bookmark-${userKey || "guest"}-${slug}`;
}

export function notifyBookmarkStorageChange(slug: string, userKey?: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(storageEventName(bookmarkStorageKey(slug, userKey))));
}
