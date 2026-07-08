import Link from "next/link";
import { ArrowRight, CalendarCheck, History, MapPin } from "lucide-react";
import { Booking } from "@/lib/api/bookings";

export default function ProfileBookingHistory({
  bookings,
}: {
  bookings: Booking[];
}) {
  const recentBookings = bookings.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-[14px] border border-sky-300/25 bg-[linear-gradient(135deg,#101820,#252827)] p-6 shadow-xl shadow-black/25">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-sky-300 text-[#07111b]">
            <History size={19} />
          </span>
          <div>
            <p className="text-2xl font-black text-white">Booking History</p>
            <span className="mt-1.5 block text-sm text-[#aeb8c3]">
              Recent trail and stay reservations from your account.
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/booking-history"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-sky-300/35 px-4 text-sm font-black text-sky-200 transition hover:bg-sky-300/10"
        >
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      {recentBookings.length ? (
        <div className="grid gap-3 md:grid-cols-3">
          {recentBookings.map((booking) => (
            <Link
              key={booking.id}
              href={
                booking.itemType === "trail"
                  ? `/dashboard/trails/${booking.itemSlug}`
                  : `/dashboard/stay/${booking.itemSlug}`
              }
              className="group rounded-lg border border-white/10 bg-[#101820] p-4 transition hover:border-sky-300/50 hover:bg-[#131d26]"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-300/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-sky-200">
                  {booking.itemType === "trail" ? "Trail" : "Stay"}
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#d7dfdf]">
                  {booking.status}
                </span>
              </div>

              <h3 className="mt-4 line-clamp-2 text-base font-black text-white">
                {booking.itemTitle}
              </h3>

              <div className="mt-4 grid gap-2 text-xs text-[#aeb8c3]">
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck size={14} className="text-sky-200" />
                  {formatDate(booking.startDate)}
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-sky-200" />
                  <span className="truncate">{booking.location || "Location not set"}</span>
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[11px] font-black uppercase tracking-wide text-[#8c9695]">
                  Total
                </span>
                <strong className="text-base font-black text-white">{booking.amount}</strong>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-[#101820] p-5 text-sm leading-6 text-[#aeb8c3]">
          No bookings yet. Confirm a trail or stay booking and it will appear here.
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  if (!value) return "Date not set";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
