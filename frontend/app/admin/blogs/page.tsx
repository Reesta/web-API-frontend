import { redirect } from "next/navigation";
import BlogTable from "./_components/BlogTable";
import { getAdminBlogsAction } from "@/lib/actions/admin/admin-blog-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string; status?: string }>;
}) {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const search = query.search || "";
  const status = query.status || "";
  const result = await getAdminBlogsAction({ page, limit, search, status });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060914] px-5 py-8 text-white sm:px-8 lg:py-10">
      <div className="relative mx-auto max-w-7xl">
        {result.success && result.data && result.meta ? (
          <BlogTable data={result.data} meta={result.meta} search={search} status={status} />
        ) : (
          <div className="rounded-[2rem] border border-red-400/30 bg-red-400/10 p-8 text-red-100">
            <h1 className="text-3xl font-black">Could not load blogs</h1>
            <p className="mt-2">{result.message || "Please try again."}</p>
          </div>
        )}
      </div>
    </main>
  );
}
