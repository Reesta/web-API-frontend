"use client";

import Link from "next/link";
import { useState } from "react";
import { loginAction } from "../../../lib/actions/auth-action";
import { LoginFormValues, validateLoginForm } from "./schema";

const inputClass =
  "w-full flex-1 border-0 bg-transparent text-[15px] text-white outline-none placeholder:text-[#7d8792]";
const inputBoxClass =
  "flex h-[54px] items-center rounded-md border border-[#2a3846] bg-[#0c1622] px-4";
const labelClass =
  "mb-2.5 block text-[13px] font-semibold uppercase tracking-[1.5px] text-[#d4d6da]";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormValues>({
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

    const validationError = validateLoginForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAction({
        email: formData.email,
        password: formData.password,
      });

      if (!response?.success) {
        setError(response?.message || "Login failed");
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#020910] lg:grid-cols-[1fr_520px]">
      <div className="relative hidden min-h-screen bg-[url('/login.png')] bg-cover bg-center lg:block">
        <div className="absolute inset-0 bg-[#020910]/75" />

        <div className="relative z-10 flex min-h-screen flex-col justify-center pl-16">
          <h1 className="mb-7 text-[56px] font-black leading-tight tracking-[4px] text-white">
            Welcome Back
          </h1>

          <p className="text-[23px] leading-relaxed tracking-[1px] text-[#f5f5f5]">
            Log in to continue your adventure with Yeti Trek.
          </p>

          <div className="mt-16 grid gap-7">
            {["Expert Local Guides", "Safety Guaranteed", "Unforgettable Experiences"].map(
              (item) => (
                <div key={item} className="flex items-center gap-5">
                  <span className="w-6 text-2xl text-[#e0a12b]">•</span>
                  <p className="text-[17px] font-bold text-white">{item}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[#020910] p-8 max-lg:p-6">
        <div className="w-full max-w-[470px] rounded-xl border border-[#1d2a36] bg-[#07111b] p-9 max-lg:p-7">
          <h2 className="mb-3 text-left text-[34px] font-black tracking-[1px] text-[#f2c400]">
            Login
          </h2>

          <p className="mb-8 text-left text-[15px] text-[#aab4c0]">
            Access your Yeti Trek account.
          </p>

          {error && (
            <p className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-[#ff7777]">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className={labelClass}>Email Address</label>
              <div className={inputBoxClass}>
                <span className="mr-3.5 text-[#7d8792]">@</span>
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-3 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#e0a12b] transition hover:text-[#f2c400]"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Password</label>
              <div className={inputBoxClass}>
                <span className="mr-3.5 text-[#7d8792]">#</span>
                <input
                  className={inputClass}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 flex h-14 w-full items-center justify-center rounded-md border-0 bg-[#f2c400] text-base font-bold text-black disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login ->"}
            </button>
          </form>

          <p className="mt-8 text-center text-[15px] text-[#aab4c0]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#f2c400]">
              Register
            </Link>
          </p>

          <div className="mt-5 border-t border-white/10 pt-5 text-center">
            <Link
              href="/admin/login"
              className="text-sm font-bold text-[#e0a12b] transition hover:text-[#f2c400]"
            >
              Login as Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
