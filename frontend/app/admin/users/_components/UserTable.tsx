"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteAdminUserAction } from "@/lib/actions/admin/admin-user-action";
import { AdminUser, UserListMeta } from "@/lib/api/admin/admin-users";

export default function UserTable({
  data,
  meta,
  search,
}: {
  data: AdminUser[];
  meta: UserListMeta;
  search: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const adminCount = data.filter((user) => user.role === "admin").length;
  const userCount = data.filter((user) => user.role === "user").length;
  const firstRow = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const lastRow = Math.min(meta.page * meta.limit, meta.total);

  const setQuery = (next: Record<string, string | number>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => query.set(key, String(value)));
    router.push(`/admin/users?${query.toString()}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery({
      search: String(new FormData(event.currentTarget).get("search") || ""),
      page: 1,
    });
  };

  const removeUser = () => {
    if (!target) return;
    setError("");

    startTransition(async () => {
      const result = await deleteAdminUserAction(target.id);
      if (!result.success) {
        setError(result.message);
        return;
      }

      setTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur">
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#e9a127]">
                Admin workspace
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                User Management
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Search, review, create, update, and remove accounts from one clean control panel.
              </p>
            </div>

            <Link
              href="/admin/users/create"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:-translate-y-0.5 hover:bg-[#f5b94d]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black/10 text-lg leading-none">
                +
              </span>
              Create user
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total users" value={meta.total} note="All registered accounts" />
            <StatCard label="Admins here" value={adminCount} note="On this page" tone="gold" />
            <StatCard label="Users here" value={userCount} note="On this page" tone="green" />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={onSearch} className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ✦
              </span>
              <input
                name="search"
                defaultValue={search}
                placeholder="Search by name or email..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#e9a127]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[#e9a127]/10"
              />
            </div>
            <button className="h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-6 text-sm font-black text-slate-100 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]">
              Search
            </button>
          </form>

          <div className="flex items-center gap-3">
            {search && (
              <button
                onClick={() => setQuery({ search: "", page: 1 })}
                className="h-12 rounded-2xl border border-white/10 px-4 text-sm font-bold text-slate-300 transition hover:border-red-300/40 hover:text-red-200"
              >
                Clear
              </button>
            )}
            <select
              value={meta.limit}
              onChange={(event) => setQuery({ limit: event.target.value, page: 1 })}
              className="h-12 rounded-2xl border border-white/10 bg-[#111a2a] px-4 text-sm font-bold text-white outline-none focus:border-[#e9a127]/70"
            >
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08101c]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.length ? (
                  data.map((user) => (
                    <tr key={user.id} className="group transition hover:bg-white/[0.035]">
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#e9a127]/25 to-cyan-400/10 text-sm font-black text-white shadow-lg shadow-black/20">
                            {getInitials(user.fullName)}
                          </div>
                          <div>
                            <p className="font-black text-white">{user.fullName}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{user.phoneNumber || "No phone added"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-slate-300">{user.email}</td>
                      <td className="px-5 py-5">
                        <span
                          className={
                            user.role === "admin"
                              ? "rounded-full border border-[#e9a127]/30 bg-[#e9a127]/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#e9a127]"
                              : "rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-200"
                          }
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-slate-400">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-5">
                        <span className="block max-w-32 truncate rounded-full bg-white/[0.04] px-3 py-1 text-xs text-slate-500">
                          {user.id}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setTarget(user)}
                            className="rounded-xl border border-red-300/20 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-500/15"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/[0.05] text-2xl">
                        ◌
                      </div>
                      <h3 className="mt-4 text-lg font-black text-white">No users found</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Try a different search term or create a new account.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing <strong className="text-slate-200">{firstRow}</strong>-
            <strong className="text-slate-200">{lastRow}</strong> of{" "}
            <strong className="text-slate-200">{meta.total}</strong> users
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setQuery({ page: meta.page - 1 })}
              className="rounded-2xl border border-white/10 px-4 py-2.5 font-bold text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-2xl bg-white/[0.06] px-4 py-2.5 font-black text-white">
              {meta.page} / {Math.max(meta.totalPages, 1)}
            </span>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setQuery({ page: meta.page + 1 })}
              className="rounded-2xl border border-white/10 px-4 py-2.5 font-bold text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {target && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1422] p-6 shadow-2xl shadow-black">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15 text-2xl text-red-200">
              !
            </div>
            <h2 className="mt-5 text-2xl font-black text-white">Delete this user?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              You are about to delete <strong className="text-white">{target.fullName}</strong>.
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setTarget(null)}
                className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={removeUser}
                disabled={isPending}
                className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-400 disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  tone = "blue",
}: {
  label: string;
  value: number;
  note: string;
  tone?: "blue" | "gold" | "green";
}) {
  const toneClass = {
    blue: "from-cyan-400/20 to-white/[0.03] text-cyan-100",
    gold: "from-[#e9a127]/25 to-white/[0.03] text-[#ffd38a]",
    green: "from-emerald-400/20 to-white/[0.03] text-emerald-100",
  }[tone];

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${toneClass} p-5`}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{note}</p>
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
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
