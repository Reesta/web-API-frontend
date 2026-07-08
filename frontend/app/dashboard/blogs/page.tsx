import Link from "next/link";
import { BookOpenText, Send } from "lucide-react";
import { getBlogsAction } from "@/lib/actions/blog-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { Blog, blogCategories } from "@/lib/api/blogs";
import BlogCard from "./_components/BlogCard";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const query = await searchParams;
  const category = query.category || "";
  const [result, currentUser] = await Promise.all([
    getBlogsAction({ category }),
    getCurrentUserAction(),
  ]);
  const blogs: Blog[] = result.success && result.data ? result.data : [];
  const featured = blogs.filter((blog) => blog.featured);
  const popular = blogs.filter((blog) => blog.popular);
  const latest = blogs.slice(0, 6);
  const userKey = currentUser.success && currentUser.data
    ? currentUser.data.id || currentUser.data.email
    : undefined;

  return (
    <section className="grid gap-8 bg-[#252827] pb-8">
      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(90deg,rgba(3,8,13,0.86),rgba(3,8,13,0.26)),url('/trail1.png')] bg-cover bg-center px-8 py-12 shadow-2xl shadow-black/25 md:px-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#e9a127]/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#e9a127]">
            <BookOpenText size={15} />
            Yeti Trek Journal
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-5xl">
            Trek guides, safety notes, and mountain stories.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Read practical Nepal trekking advice, culture notes, weather updates,
            gear tips, and stories shared by the Yeti Trek community.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/blogs" className={filterClass(!category)}>
          All
        </Link>
        {blogCategories.map((item) => {
          const params = new URLSearchParams();
          params.set("category", item);
          return (
            <Link key={item} href={`/dashboard/blogs?${params.toString()}`} className={filterClass(category === item)}>
              {item}
            </Link>
          );
        })}
        <Link href="/dashboard/blogs/submit" className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#e9a127]/40 bg-[#e9a127]/10 px-4 py-2 text-sm font-black text-[#e9a127]">
          <Send size={15} />
          Submit story
        </Link>
      </div>

      {category && (
        <div className="rounded-lg border border-white/10 bg-[#121718] px-5 py-4 text-sm text-slate-300">
          Showing <strong className="text-white">{blogs.length}</strong> result{blogs.length === 1 ? "" : "s"}
          <> in <strong className="text-[#e9a127]">{category}</strong></>
        </div>
      )}

      {featured.length > 0 && (
        <section>
          <SectionTitle eyebrow="Featured" title="Editor picks for your next trek" />
          <div className="mt-5 grid gap-6">
            <BlogCard blog={featured[0]} large userKey={userKey} />
          </div>
        </section>
      )}

      <section>
        <SectionTitle eyebrow="Latest" title="Fresh from the trail journal" />
        <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latest.length ? latest.map((blog) => <BlogCard key={blog.id} blog={blog} userKey={userKey} />) : (
            <div className="col-span-full rounded-lg border border-white/10 bg-[#121718] p-8 text-center text-[#aeb5b4]">
              No blogs found.
            </div>
          )}
        </div>
      </section>

      {popular.length > 0 && (
        <section>
          <SectionTitle eyebrow="Popular" title="Most saved and shared reads" />
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {popular.slice(0, 3).map((blog) => <BlogCard key={blog.id} blog={blog} userKey={userKey} />)}
          </div>
        </section>
      )}
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e9a127]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
    </div>
  );
}

function filterClass(active: boolean) {
  return `rounded-lg border px-4 py-2 text-sm font-black transition ${
    active
      ? "border-[#e9a127] bg-[#e9a127] text-[#121a18]"
      : "border-white/10 bg-[#121718] text-slate-300 hover:border-[#e9a127]/50 hover:text-[#e9a127]"
  }`;
}
