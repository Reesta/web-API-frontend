import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Phone, UserRound, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { itineraryDays, trails } from "../../trail-data";

const summary = [
  ["Day 1: Yeti Mountain Home", "NPR 4,500"],
  ["Day 2: Phakding Lodge", "NPR 3,800"],
  ["Day 3: Namche Bazaar Guest House", "NPR 5,200"],
  ["Day 4: Tengboche Monastery Lodge", "NPR 4,000"],
  ["Day 5: Dingboche Tea House", "NPR 4,200"],
];

export default async function TrailBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trail = trails.find((item) => item.slug === slug);

  if (!trail) {
    notFound();
  }

  return (
    <section className="grid gap-7">
      <Link
        href={`/dashboard/trails/${trail.slug}/plan`}
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#e9a127] transition hover:text-[#f0b13d]"
      >
        <ArrowLeft size={16} />
        Back to Plan
      </Link>

      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#e9a127]">
          Trek Lodge Booking
        </p>
        <h1 className="mt-2 text-[34px] font-black leading-tight text-white">
          Book lodges for {trail.title}
        </h1>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
        <form className="grid gap-5 rounded-[18px] border border-white/10 bg-[#0d1314] p-7 shadow-2xl shadow-black/25">
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={<UserRound size={16} />} label="Lead Traveler" placeholder="Your name" />
            <Field icon={<Mail size={16} />} label="Email" placeholder="you@example.com" />
            <Field icon={<Phone size={16} />} label="Phone" placeholder="+977 98XXXXXXXX" />
            <Field icon={<CalendarDays size={16} />} label="Start Date" type="date" />
            <Field icon={<Users size={16} />} label="Travelers" type="number" placeholder="2" />
            <Field label="Pickup City" placeholder="Kathmandu" />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#11191b] p-5">
            <h2 className="text-base font-black text-white">Selected Lodges</h2>
            <div className="mt-4 grid gap-3">
              {itineraryDays
                .filter((day) => day.lodge)
                .map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between gap-4 rounded-lg bg-[#0d1314] px-4 py-3 text-sm"
                  >
                    <span className="font-semibold text-white">
                      Day {day.day}: {day.lodge}
                    </span>
                    <span className="text-[#9aa4a3]">{day.price ?? "Select on arrival"}</span>
                  </div>
                ))}
            </div>
          </div>

          <button
            type="button"
            className="h-14 rounded-lg bg-[#e9a127] text-sm font-black text-[#121a18] shadow-xl shadow-[#e9a127]/20 transition hover:bg-[#f0b13d]"
          >
            Confirm Trek Booking
          </button>
        </form>

        <aside className="rounded-[18px] border border-white/10 bg-[#0d1314] p-6 shadow-2xl shadow-black/25">
          <h2 className="text-xl font-black text-white">Trip Summary</h2>
          <p className="mt-2 text-sm text-[#9aa4a3]">
            {trail.detailDuration} trek package lodge estimate.
          </p>

          <div className="mt-6 grid gap-4">
            {summary.map(([label, price]) => (
              <div key={label} className="grid grid-cols-[1fr_80px] gap-4 text-sm">
                <span className="text-[#c2c8c7]">{label}</span>
                <span className="text-right text-white">{price}</span>
              </div>
            ))}
          </div>

          <div className="my-6 h-px bg-white/10" />

          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-white">Total</span>
            <strong className="text-2xl font-black text-[#e9a127]">
              NPR 21000
            </strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  placeholder,
  type = "text",
}: {
  icon?: React.ReactNode;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white">
      {label}
      <span className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-[#11191b] px-4 transition focus-within:border-[#e9a127]">
        {icon ? <span className="text-[#e9a127]">{icon}</span> : null}
        <input
          type={type}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#687271]"
        />
      </span>
    </label>
  );
}
