"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/auth-action";
import { useAuth } from "@/app/_context/AuthContext";

const fieldClass = "grid gap-2";
const labelClass =
  "flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#d9dee5]";
const inputClass =
  "h-[50px] w-full rounded-lg border border-[#3a444f] bg-[#101820] px-3.5 text-[15px] text-white outline-none transition focus:border-[#e0a12b] focus:ring-4 focus:ring-[#e0a12b]/10 file:cursor-pointer";

export default function AccountSettingsForm() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const image = formData.get("profileImage");

    if (image instanceof File && image.size === 0) {
      formData.delete("profileImage");
    }

    const response = await updateProfileAction(formData);
    setIsSaving(false);

    if (!response?.success) {
      setError(response?.message || "Profile update failed");
      return;
    }

    setUser(response.data);
    setMessage(response.message || "Profile updated successfully");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-2 gap-5 max-[1000px]:grid-cols-1">
        <label className={fieldClass}>
          <span className={labelClass}>Full Name</span>
          <input
            className={inputClass}
            name="fullName"
            defaultValue={user.fullName}
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>Email</span>
          <input
            className={inputClass}
            type="email"
            name="email"
            defaultValue={user.email}
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>Phone Number</span>
          <input
            className={inputClass}
            name="phoneNumber"
            defaultValue={user.phoneNumber}
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>
            <Camera size={16} />
            Profile Image
          </span>
          <input
            className={`${inputClass} cursor-pointer py-3`}
            type="file"
            name="profileImage"
            accept="image/*"
          />
        </label>
      </div>

      {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-[#ffb1b1]">{error}</p>}
      {message && <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-[#a7efc4]">{message}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 inline-flex h-[50px] items-center justify-center gap-2 rounded-lg bg-[#e0a12b] px-5 text-[15px] font-black text-[#111] disabled:cursor-not-allowed disabled:opacity-65"
      >
        <Save size={18} />
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
