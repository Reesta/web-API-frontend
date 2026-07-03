import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin, ReceiptText } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { getMyBookingsAction } from "@/lib/actions/booking-action";
import { Booking } from "@/lib/api/bookings";

export const dynamic = "force-dynamic";

export default async function BookingHistoryPage() {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/login");

  const result = await getMyBookingsAction();
  const bookings: Booking[] =
    result.success && result.data
      ? result.data.filter((booking: Booking) => booking.userId === currentUser.data.id)
      : [];

  return (
    <section className="grid gap-6">
      <div className="flex items-end justify-between gap-5 rounded-[18px] border border-white/10 bg-[#0d1314] p-7 shadow-xl shadow-black/20 max-[700px]:grid">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#e9a127]">
            Booking history
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">
            Your trek and stay bookings
          </h1>
          <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#aeb5b4]">
            Recent and upcoming reservations for your Yeti Trek account.
          </p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e9a127]/15 text-[#e9a127]">
          <ReceiptText size={24} />
        </span>
      </div>

      <div className="grid gap-4">
        {!result.success ? (
          <div className="rounded-[16px] border border-red-400/30 bg-red-400/10 p-8 text-center text-red-100 shadow-xl shadow-black/15">
            {result.message || "Unable to load bookings."}
          </div>
        ) : bookings.length ? bookings.map((booking) => (
          <article
            key={booking.id}
            className="grid gap-5 rounded-[16px] border border-white/10 bg-[#101719] p-5 shadow-xl shadow-black/15 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#e9a127]/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#e9a127]">
                  {booking.itemType === "trail" ? "Trail booking" : "Stay booking"}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#d7dfdf]">
                  {booking.status}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-black text-white">
                {booking.itemTitle}
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#aeb5b4]">
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck size={16} className="text-[#e9a127]" />
                  {formatDate(booking.startDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-[#e9a127]" />
                  {booking.location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 md:grid md:justify-items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-[#8c9695]">
                  Total paid
                </p>
                <strong className="mt-1 block text-2xl font-black text-white">
                  {booking.amount}
                </strong>
              </div>
              <Link
                href={
                  booking.itemType === "trail"
                    ? `/dashboard/trails/${booking.itemSlug}`
                    : `/dashboard/stay/${booking.itemSlug}`
                }
                aria-label={`View ${booking.itemTitle}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9a127] text-[#121a18] transition hover:bg-[#f0b13d]"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        )) : (
          <div className="rounded-[16px] border border-white/10 bg-[#101719] p-8 text-center text-[#aeb5b4] shadow-xl shadow-black/15">
            No bookings yet. Confirm a trail or stay booking and it will appear here.
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  if (!value) return "Date not set";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
