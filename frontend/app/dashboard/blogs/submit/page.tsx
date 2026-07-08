import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { getTrailsAction } from "@/lib/actions/trail-action";
import { Trail } from "@/lib/api/trails";
import StoryForm from "../_components/StoryForm";

export default async function SubmitStoryPage() {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/login");

  const trailsResult = await getTrailsAction();
  const trails: Trail[] = trailsResult.success && trailsResult.data ? trailsResult.data : [];

  return (
    <section className="grid gap-6 bg-[#252827] pb-8">
      <div>
        <Link href="/dashboard/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-[#e9a127]">
          <ArrowLeft size={16} />
          Back to blogs
        </Link>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#e9a127]">
          Community stories
        </p>
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
          Submit your trekking story
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Your story will be sent to the admin dashboard for approval before it
          appears publicly in the Yeti Trek journal.
        </p>
      </div>

      <StoryForm trails={trails} />
    </section>
  );
}
