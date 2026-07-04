import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Map } from "lucide-react";
import TrailForm from "../_components/TrailForm";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function CreateAdminTrailPage() {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-[#e9a127]/15 blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-6xl">
        <Link href="/admin/trails" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]">
          <ArrowLeft size={16} />
          Back to trails
        </Link>
        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e9a127]/15 text-[#e9a127]">
              <Map size={23} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e9a127]">New route</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">Create trail</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Add a fresh trail with its own image, route details, and waypoint timeline.
              </p>
            </div>
          </div>
          <div className="mt-7"><TrailForm key="create-trail" /></div>
        </div>
      </section>
    </main>
  );
}
