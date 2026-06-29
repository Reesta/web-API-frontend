"use client";

export default function AdminUsersError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#070b13] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-red-400/30 bg-red-400/10 p-6">
        <h1 className="text-2xl font-black">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-100">The user management page could not be loaded.</p>
        <button onClick={reset} className="mt-5 rounded-lg bg-[#e9a127] px-4 py-2 text-sm font-black text-[#121a18]">Try again</button>
      </div>
    </main>
  );
}
