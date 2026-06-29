"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { loginAction, logoutAction } from "@/lib/actions/auth-action";

export default function AdminLoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await loginAction(formData);
    setIsLoading(false);

    if (!response?.success) {
      setError(response?.message || "Admin login failed");
      return;
    }

    if (response.data?.user?.role !== "admin") {
      await logoutAction();
      setError("Admin access only");
      return;
    }

    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#020910] lg:grid-cols-[1fr_500px]">
      <div className="relative hidden min-h-screen bg-[url('/trail1.png')] bg-cover bg-center lg:block">
        <div className="absolute inset-0 bg-[#020910]/75" />
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-16">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e9a127] text-[#121a18]">
            <ShieldCheck size={28} />
          </span>
          <h1 className="mt-8 max-w-xl text-[56px] font-black leading-tight text-white">
            Admin Control Panel
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
            Sign in with an admin account to manage protected Yeti Trek backend
            resources.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-[430px] rounded-2xl border border-white/10 bg-[#07111b] p-9 shadow-2xl shadow-black/30">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e9a127]">
            Admin Login
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Use an account with admin role.
          </p>

          {error && (
            <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Email Address
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="h-12 rounded-lg border border-white/10 bg-[#101820] px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="h-12 rounded-lg border border-white/10 bg-[#101820] px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 h-12 rounded-lg bg-[#e9a127] text-sm font-black text-[#121a18] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Checking..." : "Login as Admin"}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-7 block text-center text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}
