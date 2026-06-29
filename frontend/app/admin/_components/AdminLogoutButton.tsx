"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth-action";

export default function AdminLogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-bold text-slate-300 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-200"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
