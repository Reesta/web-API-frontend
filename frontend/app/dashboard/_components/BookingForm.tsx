"use client";

import { ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/lib/actions/booking-action";
import { BookingPayload } from "@/lib/api/bookings";

type Props = {
  children: ReactNode;
  submitLabel: string;
  booking: Omit<
    BookingPayload,
    "fullName" | "email" | "phone" | "startDate" | "endDate" | "travelers" | "pickupCity" | "specialRequest"
  >;
  defaultTravelers?: number;
};

export default function BookingForm({
  children,
  submitLabel,
  booking,
  defaultTravelers = 1,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setError("");

    const payload: BookingPayload = {
      ...booking,
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      startDate: String(formData.get("startDate") || "").trim(),
      endDate: String(formData.get("endDate") || "").trim(),
      travelers: Number(formData.get("travelers") || defaultTravelers) || defaultTravelers,
      pickupCity: String(formData.get("pickupCity") || "").trim(),
      specialRequest: String(formData.get("specialRequest") || "").trim(),
    };

    if (!payload.fullName || !payload.email || !payload.phone || !payload.startDate) {
      setError("Name, email, phone, and date are required.");
      return;
    }

    if (payload.itemType === "stay" && !payload.endDate) {
      setError("Check-out date is required for stay bookings.");
      return;
    }

    if (payload.startDate && payload.endDate) {
      const start = new Date(payload.startDate);
      const end = new Date(payload.endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        setError("Check-out date must be after the check-in date.");
        return;
      }
    }

    startTransition(async () => {
      const result = await createBookingAction(payload);
      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/dashboard/booking-history");
      router.refresh();
    });
  };

  return (
    <form action={submit} className="grid gap-5 rounded-[18px] border border-white/10 bg-[#0d1314] p-7 shadow-2xl shadow-black/25">
      {error ? (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">
          {error}
        </p>
      ) : null}
      {children}
      <button
        disabled={isPending}
        className="h-14 rounded-lg bg-[#e9a127] text-sm font-black text-[#121a18] shadow-xl shadow-[#e9a127]/20 transition hover:bg-[#f0b13d] disabled:opacity-60"
      >
        {isPending ? "Saving booking..." : submitLabel}
      </button>
    </form>
  );
}
