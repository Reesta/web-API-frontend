import { redirect } from "next/navigation";
import StayTable from "./_components/StayTable";
import { getAdminStaysAction } from "@/lib/actions/admin/admin-stay-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function AdminStaysPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string; search?: string }> }) {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const search = query.search || "";
  const result = await getAdminStaysAction({ page, limit, search });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-[#e9a127]/20 blur-3xl" />
      <div className="absolute right-[-180px] top-24 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        {result.success && result.data && result.meta ? (
          <StayTable data={result.data} meta={result.meta} search={search} />
        ) : (
          <div className="rounded-[2rem] border border-red-400/30 bg-red-400/10 p-8 text-red-100">
            <h1 className="text-3xl font-black">Could not load stays</h1>
            <p className="mt-2">{result.message || "Please try again."}</p>
          </div>
        )}
      </div>
    </main>
  );
}
