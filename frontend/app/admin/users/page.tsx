import { redirect } from "next/navigation";
import UserTable from "./_components/UserTable";
import { getAdminUsersAction } from "@/lib/actions/admin/admin-user-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string; search?: string }> }) {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const search = query.search || "";
  const result = await getAdminUsersAction({ page, limit, search });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-[#e9a127]/20 blur-3xl" />
      <div className="absolute right-[-180px] top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-180px] left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {result.success && result.data && result.meta ? (
          <UserTable data={result.data} meta={result.meta} search={search} />
        ) : (
          <div className="rounded-[2rem] border border-red-400/30 bg-red-400/10 p-8 text-red-100 shadow-2xl shadow-red-950/20 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-200/80">User directory</p>
            <h1 className="mt-3 text-3xl font-black">Could not load users</h1>
            <p className="mt-2 text-red-100/80">{result.message || "Please try again."}</p>
          </div>
        )}
      </div>
    </main>
  );
}
