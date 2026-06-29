import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin, ReceiptText } from "lucide-react";

const bookings = [
  {
    title: "Everest Base Camp Trek",
    type: "Trail booking",
    date: "Oct 12, 2026",
    location: "Khumbu Region",
    status: "Confirmed",
    amount: "$840",
  },
  {
    title: "Yeti Mountain Home",
    type: "Stay booking",
    date: "Oct 17, 2026",
    location: "Namche Bazaar",
    status: "Upcoming",
    amount: "$160",
  },
  {
    title: "Annapurna Base Camp",
    type: "Trail booking",
    date: "Apr 04, 2026",
    location: "Annapurna Sanctuary",
    status: "Completed",
    amount: "$690",
  },
];

export default function BookingHistoryPage() {
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
            Frontend preview of recent and upcoming reservations for your Yeti
            Trek account.
          </p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e9a127]/15 text-[#e9a127]">
          <ReceiptText size={24} />
        </span>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <article
            key={`${booking.title}-${booking.date}`}
            className="grid gap-5 rounded-[16px] border border-white/10 bg-[#101719] p-5 shadow-xl shadow-black/15 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#e9a127]/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#e9a127]">
                  {booking.type}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#d7dfdf]">
                  {booking.status}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-black text-white">
                {booking.title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#aeb5b4]">
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck size={16} className="text-[#e9a127]" />
                  {booking.date}
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
                href="/dashboard"
                aria-label={`View ${booking.title}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9a127] text-[#121a18] transition hover:bg-[#f0b13d]"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
