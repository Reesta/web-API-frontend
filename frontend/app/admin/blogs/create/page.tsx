import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BlogForm from "../_components/BlogForm";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { getTrailsAction } from "@/lib/actions/trail-action";
import { Trail } from "@/lib/api/trails";

export default async function CreateAdminBlogPage() {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const trailsResult = await getTrailsAction();
  const trails: Trail[] = trailsResult.success && trailsResult.data ? trailsResult.data : [];

  return (
    <main className="min-h-screen bg-[#060914] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/blogs" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200">
          <ArrowLeft size={16} />
          Back to blogs
        </Link>
        <h1 className="mt-6 text-4xl font-black">Create Blog</h1>
        <div className="mt-6">
          <BlogForm trails={trails} />
        </div>
      </div>
    </main>
  );
}
