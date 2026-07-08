import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/app/_context/AuthContext";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { getStaysAction } from "@/lib/actions/stay-action";
import { getTrailsAction } from "@/lib/actions/trail-action";
import { Stay } from "@/lib/api/stays";
import { Trail } from "@/lib/api/trails";
import AiChatWidget from "./_components/AiChatWidget";
import DashboardNav from "./_components/DashboardNav";
import DashboardSearch from "./_components/DashboardSearch";
import LogoutButton from "./_components/LogoutButton";
import ProfileImage from "./_components/ProfileImage";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await getCurrentUserAction();

  if (!response?.success || !response.data) {
    redirect("/login");
  }

  const user = response.data;
  const [trailsResult, staysResult] = await Promise.all([
    getTrailsAction(),
    getStaysAction(),
  ]);
  const trails: Trail[] = trailsResult.success && trailsResult.data ? trailsResult.data : [];
  const stays: Stay[] = staysResult.success && staysResult.data ? staysResult.data : [];

  return (
    <AuthProvider initialUser={user}>
      <div className="grid min-h-screen grid-cols-[280px_minmax(0,1fr)] bg-[#242625] text-[#f7f7f7] max-[1000px]:grid-cols-1">
        <aside className="flex min-h-screen flex-col justify-between border-r border-[#202a36] bg-[#070c16] max-[1000px]:min-h-0">
          <div>
            <Link
              href="/dashboard"
              className="flex h-[74px] items-center border-b border-[#202a36] px-[18px] text-base font-black text-[#e0a12b] max-[1000px]:h-[62px]"
            >
              Dashboard
            </Link>

            <div className="flex items-center gap-3 border-b border-white/10 px-[18px] py-[22px] max-[1000px]:hidden">
              <ProfileImage user={user} size="small" />
              <div>
                <p className="text-[15px] font-bold">{user.fullName}</p>
                <span className="block max-w-[185px] truncate text-[13px] text-[#9aa8b8]">
                  {user.email}
                </span>
              </div>
            </div>

            <DashboardNav />
          </div>

          <LogoutButton />
        </aside>

        <section className="min-w-0 min-h-screen bg-[#252827]">
          <header className="flex h-[74px] items-center justify-between border-b border-[#202a36] bg-[#080d16] px-7 max-[1000px]:hidden">
            <div>
              <p className="text-base font-black text-[#f5f5f5]">Yeti Trek</p>
              <span className="text-[13px] text-[#9aa8b8]">Ready for your next adventure?</span>
            </div>
            <DashboardSearch trails={trails} stays={stays} />
          </header>

          <main className="w-full max-w-[1120px] px-8 pb-14 pt-6 max-[1000px]:p-[22px]">
            {children}
          </main>
        </section>
        <AiChatWidget />
      </div>
    </AuthProvider>
  );
}
