"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { requestPasswordResetAction } from "@/lib/actions/auth-action";
import {
  RequestPasswordResetSchema,
  RequestPasswordResetValues,
} from "./schema";

export default function ForgetForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RequestPasswordResetValues>({
      resolver: zodResolver(RequestPasswordResetSchema),
    });

  const onSubmit = async (data: RequestPasswordResetValues) => {
    const response = await requestPasswordResetAction(data.email);
    if (!response.success) {
      toast.error(response.message || "Unable to send password reset email");
      return;
    }
    toast.success("Password reset link sent to your email.");
    router.push("/login");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#020910] p-6">
      <section className="w-full max-w-[470px] rounded-xl border border-[#1d2a36] bg-[#07111b] p-8 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[2px] text-[#e0a12b]">Account recovery</p>
        <h1 className="mt-3 text-3xl font-black text-[#f2c400]">Forgot password?</h1>
        <p className="mt-3 text-[15px] leading-6 text-[#aab4c0]">Enter your email and we will send you a link to create a new password.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <label className="mb-2.5 block text-[13px] font-semibold uppercase tracking-[1.5px] text-[#d4d6da]">Email address</label>
          <input type="email" placeholder="Enter your email" {...register("email")} className="h-[54px] w-full rounded-md border border-[#2a3846] bg-[#0c1622] px-4 text-[15px] text-white outline-none placeholder:text-[#7d8792] focus:border-[#e0a12b]" />
          {errors.email && <p className="mt-2 text-sm text-[#ff7777]">{errors.email.message}</p>}
          <button disabled={isSubmitting} className="mt-6 flex h-14 w-full items-center justify-center rounded-md bg-[#f2c400] text-base font-bold text-black disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? "Sending..." : "Send reset link"}</button>
        </form>
        <Link href="/login" className="mt-7 block text-center text-sm font-semibold text-[#e0a12b] transition hover:text-[#f2c400]">← Back to login</Link>
      </section>
    </main>
  );
}
