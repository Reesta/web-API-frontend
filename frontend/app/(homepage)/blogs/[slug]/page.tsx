import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Compass, LogIn, MessageSquare, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogBySlugAction } from "@/lib/actions/blog-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { getTrailsAction } from "@/lib/actions/trail-action";
import { Blog } from "@/lib/api/blogs";
import { Trail } from "@/lib/api/trails";
import { resolveImageUrl } from "@/lib/api/image-url";
import BlogActions from "../../../dashboard/blogs/_components/BlogActions";
import CommentForm from "../../../dashboard/blogs/_components/CommentForm";

export default async function PublicBlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blogResult, trailsResult, currentUser] = await Promise.all([
    getBlogBySlugAction(slug),
    getTrailsAction(),
    getCurrentUserAction(),
  ]);
  const blog = blogResult.success ? (blogResult.data as Blog | null) : null;
  const isAuthenticated = Boolean(currentUser.success && currentUser.data);
  const userKey = currentUser.success && currentUser.data
    ? currentUser.data.id || currentUser.data.email
    : undefined;

  if (!blog) {
    notFound();
  }

  const trails: Trail[] = trailsResult.success && trailsResult.data ? trailsResult.data : [];
  const relatedTrails = trails.filter((trail) => blog.relatedTrailSlugs.includes(trail.slug));

  return (
    <article className="bg-[#070b13] px-5 pb-24 pt-32 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#121718] shadow-2xl shadow-black/25">
          <div className="relative min-h-[420px]">
            <Image
              src={resolveImageUrl(blog.coverImage)}
              alt={blog.title}
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-[#070b13]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <span className="rounded bg-[#e9a127] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#121212]">
                {blog.category}
              </span>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
                {blog.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-300">
                <span className="inline-flex items-center gap-2"><UserRound size={16} /> {blog.authorName}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {formatDate(blog.publishDate || blog.createdAt)}</span>
                <span className="inline-flex items-center gap-2"><Clock3 size={16} /> {blog.readingTime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 p-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm leading-7 text-slate-300">{blog.description}</p>
            <BlogActions
              slug={blog.slug}
              title={blog.title}
              isAuthenticated={isAuthenticated}
              basePath="/blogs"
              userKey={userKey}
            />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-white/10 bg-[#121718] p-6 shadow-xl shadow-black/20 md:p-8">
            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-8 prose-h2:text-white">
              {blog.content.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <section className="rounded-lg border border-white/10 bg-[#121718] p-5">
              <div className="flex items-center gap-2 text-[#e9a127]">
                <Compass size={18} />
                <h2 className="font-black text-white">Related treks</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {relatedTrails.length ? relatedTrails.map((trail) => (
                  <div key={trail.slug} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-black text-white">{trail.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{trail.duration} - {trail.difficulty}</p>
                    <Link href={`/dashboard/trails/${trail.slug}`} className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#e9a127] px-4 text-xs font-black text-[#121a18]">
                      View Trek
                    </Link>
                  </div>
                )) : (
                  <p className="text-sm leading-6 text-slate-400">
                    No related trek has been linked to this blog yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#121718] p-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-[#e9a127]" size={18} />
                <h2 className="font-black text-white">Comments</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {blog.comments.length ? blog.comments.map((comment, index) => (
                  <div key={`${comment.createdAt}-${index}`} className="rounded-lg bg-white/[0.04] p-3">
                    <p className="text-xs font-black text-white">{comment.authorName}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{comment.text}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400">No comments yet.</p>
                )}
              </div>
            </section>
          </aside>
        </div>

        {isAuthenticated ? (
          <CommentForm slug={blog.slug} />
        ) : (
          <div className="rounded-lg border border-white/10 bg-[#121718] p-5">
            <h2 className="text-xl font-black text-white">Join the conversation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              You can read this article as a guest. Login is required only when
              you want to comment, bookmark, like, share, or submit a story.
            </p>
            <Link href="/login" className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#e9a127] px-5 text-sm font-black text-[#121a18]">
              <LogIn size={16} />
              Login to comment
            </Link>
          </div>
        )}
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
