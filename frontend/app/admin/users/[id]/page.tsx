import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminUserAction } from "@/lib/actions/admin/admin-user-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function AdminUserDetailPage({
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

  const user = result.data;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-[#e9a127]/20 blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-4xl">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]"
        >
          ← Back to users
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur">
          <div className="border-b border-white/10 bg-gradient-to-br from-[#e9a127]/15 via-white/[0.03] to-cyan-400/10 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-[1.75rem] border border-white/10 bg-[#0d1422] text-2xl font-black shadow-xl shadow-black/30">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e9a127]">
                    User profile
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    {user.fullName}
                  </h1>
                  <p className="mt-1 text-sm text-slate-300">{user.email}</p>
                </div>
              </div>

              <Link
                href={`/admin/users/${id}/edit`}
                className="inline-flex justify-center rounded-2xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:-translate-y-0.5 hover:bg-[#f5b94d]"
              >
                Edit user
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <InfoCard label="Email address" value={user.email} />
            <InfoCard label="Phone number" value={user.phoneNumber || "Not added"} />
            <InfoCard label="Role" value={user.role} badge />
            <InfoCard label="Created on" value={formatDate(user.createdAt)} />
            <div className="rounded-3xl border border-white/10 bg-[#0d1422]/80 p-5 sm:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                User ID
              </p>
              <p className="mt-3 break-all rounded-2xl bg-black/20 px-4 py-3 font-mono text-xs text-slate-300">
                {user.id}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1422]/80 p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      {badge ? (
        <span className="mt-3 inline-flex rounded-full border border-[#e9a127]/30 bg-[#e9a127]/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#e9a127]">
          {value}
        </span>
      ) : (
        <p className="mt-3 font-bold text-white">{value}</p>
      )}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
