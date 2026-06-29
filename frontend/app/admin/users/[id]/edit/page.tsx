import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import UserForm from "../../_components/UserForm";
import { getAdminUserAction } from "@/lib/actions/admin/admin-user-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function EditAdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const result = await getAdminUserAction(id);
  if (!result.success || !result.data) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-[#e9a127]/20 blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-3xl">
        <Link
          href={`/admin/users/${id}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]"
        >
          ← Back to user
        </Link>

        <div className="mt-6 rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e9a127]">
            Account editor
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Edit user</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Update account details, adjust permissions, or set a new password for this user.
          </p>

          <div className="mt-7">
            <UserForm user={result.data} />
          </div>
        </div>
      </section>
    </main>
  );
}
