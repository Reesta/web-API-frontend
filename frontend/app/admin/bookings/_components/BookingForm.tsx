"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAdminBookingAction } from "@/lib/actions/admin/admin-booking-action";
import { AdminBooking, AdminBookingPayload } from "@/lib/api/admin/admin-bookings";

const statuses: AdminBookingPayload["status"][] = [
  "Pending",
  "Confirmed",
  "Cancelled",
];

export default function BookingForm({ booking }: { booking: AdminBooking }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const payload: AdminBookingPayload = {
      status: String(form.get("status")) as AdminBookingPayload["status"],
      startDate: String(form.get("startDate") || ""),
      endDate: String(form.get("endDate") || ""),
      travelers: Number(form.get("travelers")) || 1,
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      pickupCity: String(form.get("pickupCity") || ""),
      specialRequest: String(form.get("specialRequest") || ""),
      amount: String(form.get("amount") || ""),
    };

    startTransition(async () => {
      const result = await updateAdminBookingAction(booking.id, payload);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(`/admin/bookings/${booking.id}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Lead traveler" name="fullName" defaultValue={booking.fullName} />
        <Field label="Email" name="email" type="email" defaultValue={booking.email} />
        <Field label="Phone" name="phone" defaultValue={booking.phone} />
        <Field label="Pickup city" name="pickupCity" defaultValue={booking.pickupCity || ""} />
        <Field label="Start date" name="startDate" type="date" defaultValue={dateInput(booking.startDate)} />
        <Field label="End date" name="endDate" type="date" defaultValue={dateInput(booking.endDate)} />
        <Field label="Travelers" name="travelers" type="number" min="1" defaultValue={String(booking.travelers)} />
        <Field label="Amount" name="amount" defaultValue={booking.amount} />
        <label className="space-y-2">
          <span className="text-sm font-black text-slate-200">Status</span>
          <select
            name="status"
            defaultValue={booking.status}
            className="h-13 w-full rounded-2xl border border-white/10 bg-[#08101c] px-4 py-4 text-sm font-bold text-white outline-none focus:border-[#e9a127]/70"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </section>

      <label className="block space-y-2">
        <span className="text-sm font-black text-slate-200">Special request</span>
        <textarea
          name="specialRequest"
          defaultValue={booking.specialRequest || ""}
          rows={5}
          className="w-full rounded-2xl border border-white/10 bg-[#08101c] px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-[#e9a127]/70"
        />
      </label>

      <div className="rounded-3xl border border-white/10 bg-[#08101c]/70 p-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
          Booking item
        </p>
        <p className="mt-3 text-lg font-black text-white">{booking.itemTitle}</p>
        <p className="mt-1 text-sm text-slate-400">
          {booking.itemType === "trail" ? "Trail" : "Stay"} booking
          {booking.location ? ` - ${booking.location}` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-200"
        >
          Cancel
        </button>
        <button
          disabled={isPending}
          className="rounded-2xl bg-[#e9a127] px-6 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save booking"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  min?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-black text-slate-200">{label}</span>
      <input
        name={name}
        type={type}
        min={min}
        defaultValue={defaultValue}
        className="h-13 w-full rounded-2xl border border-white/10 bg-[#08101c] px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-[#e9a127]/70"
      />
    </label>
  );
}

function dateInput(value?: string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}
