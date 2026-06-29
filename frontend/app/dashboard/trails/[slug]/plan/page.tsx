import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CirclePlus, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { itineraryDays, trails } from "../../trail-data";

const summary = [
  ["Day 1: Yeti Mountain Home", "NPR 4,500"],
  ["Day 2: Phakding Lodge", "NPR 3,800"],
  ["Day 3: Namche Bazaar Guest House", "NPR 5,200"],
  ["Day 4: Tengboche Monastery Lodge", "NPR 4,000"],
  ["Day 5: Dingboche Tea House", "NPR 4,200"],
];

export default async function TrekPlanPage({
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
      <div>
        <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[#e9a127]">
          {trail.title}
        </p>
        <h1 className="mt-1 text-[32px] font-black leading-tight text-white">
          Interactive Itinerary
        </h1>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="relative grid gap-3 pl-8 before:absolute before:left-3 before:top-4 before:h-[calc(100%-20px)] before:w-px before:bg-white/10">
          {itineraryDays.map((day) => (
            <article
              key={day.day}
              className={`relative rounded-lg border border-white/5 bg-[#1f2221] p-6 shadow-xl shadow-black/15 ${
                day.day > 2 ? "opacity-70" : ""
              }`}
            >
              <span className="absolute -left-[43px] top-6 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1f2221] text-xs font-black text-white">
                {day.day}
              </span>

              <h2 className="text-2xl font-black text-white">
                Day {day.day}: {day.title}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#aeb5b4]">
                <Clock3 size={14} />
                {day.meta}
              </p>
              <p className="mt-6 max-w-[690px] text-sm leading-7 text-[#aeb5b4]">
                {day.text}
              </p>

              {day.lodge && day.image ? (
                <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#202829] p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-16 overflow-hidden rounded-md">
                      <Image
                        src={day.image}
                        alt={day.lodge}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{day.lodge}</h3>
                      <p className="mt-1 text-xs text-[#aeb5b4]">{day.price}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider text-[#aeb5b4]">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    Change
                  </span>
                </div>
              ) : day.lodge ? (
                <Link
                  href="/dashboard/stay"
                  className="mt-5 flex h-24 items-center justify-center rounded-lg border border-dashed border-white/15 text-[11px] font-black tracking-wider text-[#aeb5b4] transition hover:border-[#e9a127] hover:text-[#e9a127]"
                >
                  <CirclePlus size={18} className="mr-2 text-[#aeb5b4]" />
                  {day.lodge}
                </Link>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="sticky top-24 rounded-lg border border-[#e9a127]/50 border-t-[#e9a127] bg-[#1f2221] p-8 shadow-2xl shadow-black/25 max-lg:static">
          <h2 className="text-2xl font-light text-white">Trip Summary</h2>

          <p className="mt-8 text-[11px] font-black uppercase tracking-wider text-[#9aa4a3]">
            Lodge Summary
          </p>

          <div className="mt-5 grid gap-4">
            {summary.map(([label, price]) => (
              <div key={label} className="grid grid-cols-[1fr_80px] gap-5 text-sm">
                <span className="text-[#c2c8c7]">{label}</span>
                <span className="text-right text-white">{price}</span>
              </div>
            ))}
          </div>

          <div className="my-8 h-px bg-white/10" />

          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">Total</span>
            <strong className="text-2xl font-black text-[#e9a127]">
              NPR 21000
            </strong>
          </div>

          <Link
            href={`/dashboard/trails/${trail.slug}/booking`}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-lg border-0 bg-[#e9a127] text-sm font-black text-[#121a18] shadow-xl shadow-[#e9a127]/20 transition hover:bg-[#f0b13d]"
          >
            Book all 5 Lodges
          </Link>
        </aside>
      </div>
    </section>
  );
}
