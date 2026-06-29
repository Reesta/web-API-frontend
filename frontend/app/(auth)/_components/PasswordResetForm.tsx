"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { resetPasswordAction } from "@/lib/actions/auth-action";
import { ResetPasswordSchema, ResetPasswordValues } from "./schema";

export default function PasswordResetForm({ token }: { token: string }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ResetPasswordValues>({ resolver: zodResolver(ResetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      toast.error("This password reset link is invalid. Request a new one.");
      return;
    }
    const response = await resetPasswordAction(token, data.password);
    if (!response.success) {
      toast.error(response.message || "Unable to reset password");
      return;
    }
    toast.success("Password reset successfully. Please log in.");
    router.replace("/login");
  };

  const inputClass = "h-[54px] w-full rounded-md border border-[#2a3846] bg-[#0c1622] px-4 text-[15px] text-white outline-none placeholder:text-[#7d8792] focus:border-[#e0a12b]";
  return (
    <main className="grid min-h-screen place-items-center bg-[#020910] p-6">
      <section className="w-full max-w-[470px] rounded-xl border border-[#1d2a36] bg-[#07111b] p-8 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[2px] text-[#e0a12b]">Account recovery</p>
        <h1 className="mt-3 text-3xl font-black text-[#f2c400]">Set new password</h1>
        <p className="mt-3 text-[15px] leading-6 text-[#aab4c0]">Choose a strong password with at least six characters.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div><label className="mb-2.5 block text-[13px] font-semibold uppercase tracking-[1.5px] text-[#d4d6da]">New password</label><input type="password" {...register("password")} className={inputClass} />{errors.password && <p className="mt-2 text-sm text-[#ff7777]">{errors.password.message}</p>}</div>
          <div><label className="mb-2.5 block text-[13px] font-semibold uppercase tracking-[1.5px] text-[#d4d6da]">Confirm new password</label><input type="password" {...register("confirmPassword")} className={inputClass} />{errors.confirmPassword && <p className="mt-2 text-sm text-[#ff7777]">{errors.confirmPassword.message}</p>}</div>
          <button disabled={isSubmitting} className="flex h-14 w-full items-center justify-center rounded-md bg-[#f2c400] text-base font-bold text-black disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? "Resetting..." : "Reset password"}</button>
        </form>
        <div className="mt-7 flex justify-center gap-5 text-sm font-semibold"><Link href="/login" className="text-[#e0a12b] hover:text-[#f2c400]">Back to login</Link><Link href="/forgot-password" className="text-[#e0a12b] hover:text-[#f2c400]">Request another link</Link></div>
      </section>
    </main>
  );
}
