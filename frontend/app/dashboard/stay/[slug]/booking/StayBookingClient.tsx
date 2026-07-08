"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, Mail, Phone, UserRound, Users } from "lucide-react";
import BookingForm from "../../../_components/BookingForm";
import { resolveImageUrl } from "@/lib/api/image-url";
import { Stay } from "@/lib/api/stays";

export default function StayBookingClient({ stay }: { stay: Stay }) {
  const [guests, setGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const nightlyPrice = parseMoney(stay.price);
  const nights = getStayNights(checkInDate, checkOutDate);
  const total = nightlyPrice * guests * nights;
  const amount = formatMoney(total || nightlyPrice);

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
      <BookingForm
        submitLabel="Confirm Booking"
        booking={{
          itemType: "stay",
          itemId: stay.id,
          itemSlug: stay.slug,
          itemTitle: stay.name,
          amount,
          location: stay.distance,
        }}
        defaultTravelers={guests}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="fullName" icon={<UserRound size={16} />} label="Full Name" placeholder="Your name" />
          <Field name="email" icon={<Mail size={16} />} label="Email" placeholder="you@example.com" />
          <Field name="phone" icon={<Phone size={16} />} label="Phone" placeholder="+977 98XXXXXXXX" />
          <Field
            name="startDate"
            icon={<CalendarDays size={16} />}
            label="Check-in Date"
            type="date"
            value={checkInDate}
            onChange={setCheckInDate}
          />
          <Field
            name="endDate"
            icon={<CalendarDays size={16} />}
            label="Check-out Date"
            type="date"
            value={checkOutDate}
            min={checkInDate || undefined}
            onChange={setCheckOutDate}
          />
          <Field
            name="travelers"
            icon={<Users size={16} />}
            label="Guests"
            type="number"
            value={guests}
            onChange={(value) => setGuests(Math.max(1, Number(value) || 1))}
          />
        </div>

        <label className="grid gap-2 text-sm font-bold text-white">
          Special Request
          <textarea
            name="specialRequest"
            rows={5}
            placeholder="Meal preference, arrival time, or room notes"
            className="resize-none rounded-lg border border-white/10 bg-[#11191b] px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-[#687271] focus:border-[#e9a127]"
          />
        </label>
      </BookingForm>

      <aside className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1314] shadow-2xl shadow-black/25">
        <div className="relative h-[190px]">
          <Image
            src={resolveImageUrl(stay.image)}
            alt={stay.name}
            fill
            unoptimized
            sizes="330px"
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-black text-white">{stay.name}</h2>
          <p className="mt-2 text-sm text-[#9aa4a3]">{stay.distance}</p>
          <div className="my-5 h-px bg-white/10" />
          <div className="flex items-center justify-between text-sm text-[#9aa4a3]">
            <span>Nightly price</span>
            <span>{stay.price}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#9aa4a3]">
            <span>Nights</span>
            <span>x {nights}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#9aa4a3]">
            <span>Guests</span>
            <span>x {guests}</span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8e9898]">
              Total
            </span>
            <strong className="text-2xl font-black text-[#e9a127]">
              {amount}
            </strong>
          </div>
          <span className="mt-2 block text-xs text-[#8e9898]">
            {stay.price} x {nights} night{nights === 1 ? "" : "s"} x {guests} guest{guests === 1 ? "" : "s"}
          </span>
        </div>
      </aside>
    </div>
  );
}

function Field({
  name,
  icon,
  label,
  placeholder,
  type = "text",
  value,
  min,
  onChange,
}: {
  name: string;
  icon?: React.ReactNode;
  label: string;
  placeholder?: string;
  type?: string;
  value?: number | string;
  min?: number | string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white">
      {label}
      <span className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-[#11191b] px-4 transition focus-within:border-[#e9a127]">
        {icon ? <span className="text-[#e9a127]">{icon}</span> : null}
        <input
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          min={min ?? (type === "number" ? 1 : undefined)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#687271]"
        />
      </span>
    </label>
  );
}

function parseMoney(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function getStayNights(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return 1;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = end.getTime() - start.getTime();
  const nights = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 1;
}

function formatMoney(value: number) {
  return `NPR ${value.toLocaleString("en-US")}`;
}
