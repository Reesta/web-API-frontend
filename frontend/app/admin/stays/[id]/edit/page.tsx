import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Hotel } from "lucide-react";
import StayForm from "../../_components/StayForm";
import { getAdminStayAction } from "@/lib/actions/admin/admin-stay-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function EditAdminStayPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const result = await getAdminStayAction(id);
  if (!result.success || !result.data) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <section className="relative mx-auto max-w-6xl">
        <Link href="/admin/stays" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200">
          <ArrowLeft size={16} /> Back to stays
        </Link>
        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e9a127]/15 text-[#e9a127]"><Hotel size={23} /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e9a127]">Stay editor</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">Edit stay</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Update this lodge listing and its public stay details.</p>
            </div>
          </div>
          <div className="mt-7"><StayForm key={result.data.id} stay={result.data} /></div>
        </div>
      </section>
    </main>
  );
}
