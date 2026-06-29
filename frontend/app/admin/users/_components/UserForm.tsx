"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AdminUser,
  AdminUserPayload,
} from "@/lib/api/admin/admin-users";
import {
  createAdminUserAction,
  updateAdminUserAction,
} from "@/lib/actions/admin/admin-user-action";

type Props = { user?: AdminUser };

export default function UserForm({ user }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(user);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const payload: AdminUserPayload = {
      fullName: String(form.get("fullName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phoneNumber: String(form.get("phoneNumber") || "").trim(),
      role: form.get("role") === "admin" ? "admin" : "user",
      ...(password ? { password } : {}),
    };

    if (!payload.fullName || !payload.email || !payload.phoneNumber) {
      setError("Full name, email, and phone number are required.");
      return;
    }
    if (!isEditing && !password) {
      setError("Password is required when creating a user.");
      return;
    }
    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateAdminUserAction(user!.id, payload)
        : await createAdminUserAction(payload);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push("/admin/users");
      router.refresh();
    });
  };

  const inputClass =
    "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]/70 focus:bg-black/30 focus:ring-4 focus:ring-[#e9a127]/10";

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-[2rem] border border-white/10 bg-[#0d1422]/90 p-5 shadow-xl shadow-black/20 sm:p-6"
    >
      {error && (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-black text-slate-200">
          Full name
          <input
            name="fullName"
            defaultValue={user?.fullName}
            placeholder="e.g. Reesta Maharjan"
            className={inputClass}
            required
          />
        </label>

        <label className="block text-sm font-black text-slate-200">
          Email
          <input
            name="email"
            type="email"
            defaultValue={user?.email}
            placeholder="name@example.com"
            className={inputClass}
            required
          />
        </label>

        <label className="block text-sm font-black text-slate-200">
          Phone number
          <input
            name="phoneNumber"
            defaultValue={user?.phoneNumber}
            placeholder="98XXXXXXXX"
            className={inputClass}
            required
            minLength={10}
          />
        </label>

        <label className="block text-sm font-black text-slate-200">
          Role
          <select name="role" defaultValue={user?.role || "user"} className={inputClass}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-black text-slate-200">
        {isEditing ? "New password" : "Password"}
        <input
          name="password"
          type="password"
          placeholder={isEditing ? "Leave blank to keep current password" : "Minimum 6 characters"}
          className={inputClass}
          required={!isEditing}
          minLength={isEditing ? undefined : 6}
        />
        {isEditing && (
          <span className="mt-2 block text-xs font-medium text-slate-500">
            Only fill this if you want to replace the user&apos;s current password.
          </span>
        )}
      </label>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.06]"
        >
          Cancel
        </button>
        <button
          disabled={isPending}
          className="rounded-2xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:bg-[#f5b94d] disabled:opacity-60"
        >
          {isPending ? "Saving..." : isEditing ? "Save changes" : "Create user"}
        </button>
      </div>
    </form>
  );
}
