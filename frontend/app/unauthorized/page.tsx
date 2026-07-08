import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b13] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-[#0d1420] p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#D89A2B]">
          Unauthorized
        </p>
        <h1 className="mt-4 text-3xl font-black">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          You do not have permission to open this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#D89A2B] px-5 text-sm font-black text-black transition hover:bg-[#e7ad3e]"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
