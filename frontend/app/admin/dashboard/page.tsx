import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CircleCheck,
  Clock3,
  Database,
  Hotel,
  Map,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import AdminLogoutButton from "../_components/AdminLogoutButton";

const features = [
  { label: "User directory", detail: "Create, update, and remove accounts.", icon: Users, href: "/admin/users", tone: "bg-[#e9a127] text-[#17120a]", available: true },
  { label: "Trail catalogue", detail: "Manage trek routes and trip details.", icon: Map, href: "#", tone: "bg-sky-400/15 text-sky-300", available: false },
  { label: "Stay listings", detail: "Manage lodges and accommodation data.", icon: Hotel, href: "#", tone: "bg-emerald-400/15 text-emerald-300", available: false },
];

export default async function AdminDashboardPage() {
  const response = await getCurrentUserAction();
  if (!response?.success || !response.data) redirect("/admin/login");
  if (response.data.role !== "admin") redirect("/dashboard");

  const initial = response.data.fullName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d16] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#e9a127]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <header className="border-b border-white/10 bg-[#080d16]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9a127] text-[#17120a] shadow-lg shadow-[#e9a127]/20"><ShieldCheck size={21} /></span>
            <span><strong className="block text-sm font-black tracking-wide">YETI TREK</strong><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e9a127]">Administration</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-white/30 hover:text-white sm:block">View site</Link>
            <AdminLogoutButton />
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e9a127]/15 text-sm font-black text-[#e9a127]">{initial}</div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
        <div className="grid gap-8 xl:grid-cols-[1.55fr_0.9fr]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(120deg,#141f2d_0%,#0e1622_58%,#11151b_100%)] p-7 shadow-2xl shadow-black/20 sm:p-10">
            <div className="absolute right-0 top-0 h-56 w-56 bg-[radial-gradient(circle_at_top_right,rgba(233,161,39,0.22),transparent_70%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e9a127]/25 bg-[#e9a127]/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#f6c76f]"><Sparkles size={14} /> Operations workspace</span>
              <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">Good to see you, <span className="text-[#f0b342]">{response.data.fullName.split(" ")[0]}</span>.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Manage the people behind Yeti Trek from one secure place. Your admin tools are ready when you are.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/admin/users" className="inline-flex items-center gap-2 rounded-xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#17120a] shadow-lg shadow-[#e9a127]/20 transition hover:-translate-y-0.5 hover:bg-[#f3b943]">Manage users <ArrowRight size={17} /></Link>
                <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/35 hover:bg-white/5">Open user dashboard <ChevronRight size={17} /></Link>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-[#101925]/85 p-6 shadow-xl shadow-black/20 sm:p-7">
            <div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Signed in as</p><BadgeCheck className="text-[#e9a127]" size={22} /></div>
            <div className="mt-6 flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e9a127] text-xl font-black text-[#17120a]">{initial}</span><div><h2 className="font-black text-white">{response.data.fullName}</h2><p className="mt-1 text-sm text-slate-400">{response.data.email}</p></div></div>
            <div className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] p-4"><div className="flex items-center gap-2 text-sm font-black text-emerald-300"><CircleCheck size={17} /> Verified administrator</div><p className="mt-2 text-sm leading-6 text-slate-400">Your account has permission to manage protected platform data.</p></div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-500"><Clock3 size={14} /> Session active</div>
          </aside>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#101925]/75 p-5"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e9a127]/15 text-[#e9a127]"><Users size={21} /></span><span className="text-xs font-black uppercase tracking-wider text-emerald-300">Live</span></div><p className="mt-5 text-sm text-slate-400">Core module</p><h2 className="mt-1 text-xl font-black">User management</h2></div>
          <div className="rounded-2xl border border-white/10 bg-[#101925]/75 p-5"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-400/15 text-sky-300"><ShieldCheck size={21} /></span><span className="text-xs font-black uppercase tracking-wider text-emerald-300">Secured</span></div><p className="mt-5 text-sm text-slate-400">Access control</p><h2 className="mt-1 text-xl font-black">Admin role verified</h2></div>
          <div className="rounded-2xl border border-white/10 bg-[#101925]/75 p-5"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-400/15 text-violet-300"><Activity size={21} /></span><span className="text-xs font-black uppercase tracking-wider text-slate-400">Ready</span></div><p className="mt-5 text-sm text-slate-400">Platform status</p><h2 className="mt-1 text-xl font-black">Operations online</h2></div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <section><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#e9a127]">Workspace</p><h2 className="mt-2 text-2xl font-black">Management tools</h2></div><Database className="text-slate-600" size={28} /></div><div className="mt-5 grid gap-3">{features.map((feature) => { const Icon = feature.icon; return <Link key={feature.label} href={feature.href} className={`group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#101925]/75 p-5 transition ${feature.available ? "hover:-translate-y-0.5 hover:border-[#e9a127]/45 hover:bg-[#14202e]" : "cursor-default opacity-65"}`}><span className={`grid h-12 w-12 place-items-center rounded-xl ${feature.tone}`}><Icon size={21} /></span><span className="min-w-0 flex-1"><strong className="block text-base">{feature.label}</strong><span className="mt-1 block text-sm text-slate-400">{feature.detail}</span></span>{feature.available ? <ArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-[#e9a127]" size={19} /> : <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">Coming soon</span>}</Link>; })}</div></section>
          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101925]/75 p-6"><div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border border-[#e9a127]/20" /><div className="absolute -right-4 -top-8 h-28 w-28 rounded-full border border-[#e9a127]/15" /><div className="relative"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#e9a127]">Quick launch</p><h2 className="mt-2 text-2xl font-black">Choose your next trail.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">A small command deck for the tasks you need most—no extra noise.</p><div className="mt-7 space-y-3"><Link href="/admin/users" className="group flex items-center gap-4 rounded-2xl border border-[#e9a127]/25 bg-[#e9a127]/10 p-4 transition hover:bg-[#e9a127]/15"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9a127] text-[#17120a]"><Users size={19} /></span><span className="flex-1"><strong className="block text-sm">Open user directory</strong><span className="mt-0.5 block text-xs text-slate-400">Search, edit, or remove accounts</span></span><ArrowRight className="text-[#e9a127] transition group-hover:translate-x-1" size={18} /></Link><Link href="/admin/users/create" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.07]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-400/15 text-sky-300"><Sparkles size={19} /></span><span className="flex-1"><strong className="block text-sm">Create a user</strong><span className="mt-0.5 block text-xs text-slate-400">Set up a new admin or user account</span></span><ArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-sky-300" size={18} /></Link></div><div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Admin workspace ready</div></div></aside>
        </div>
      </section>
    </main>
  );
}
