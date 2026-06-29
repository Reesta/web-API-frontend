import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { trails } from "./trail-data";

export default function TrailsPage() {
  return (
    <section className="bg-[#252827] pb-8">
      <div className="overflow-hidden rounded-[18px] bg-[linear-gradient(90deg,rgba(3,8,13,0.55),rgba(3,8,13,0.05)),url('/trail1.png')] bg-cover bg-center px-12 py-12 shadow-2xl shadow-black/25 max-[700px]:px-6">
        <h1 className="max-w-[430px] text-[48px] font-light leading-[1.18] text-white max-[700px]:text-4xl">
          Chasing your destiny
        </h1>

        <Link
          href="#trail-list"
          className="mt-10 inline-flex h-11 items-center gap-2 rounded-lg bg-[#e0a12b] px-7 text-sm font-black text-[#121212]"
        >
          Start Exploring
          <ArrowRight size={15} />
        </Link>
      </div>

      <div id="trail-list" className="mt-14 grid grid-cols-3 gap-7 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        {trails.map((trail) => (
          <article
            key={trail.title}
            className="overflow-hidden rounded-lg bg-[#121718] shadow-xl shadow-black/20"
          >
            <div
              className="relative h-[190px] bg-cover bg-center"
              style={{ backgroundImage: `url(${trail.image})` }}
            >
              <span
                className={`absolute left-4 top-4 rounded px-2 py-1 text-[9px] font-black uppercase text-white ${trail.badge}`}
              >
                {trail.difficulty}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[15px] font-medium uppercase tracking-wide text-white">
                  {trail.title}
                </h2>
                <strong className="shrink-0 text-[15px] font-black text-[#e9a127]">
                  {trail.altitude}
                </strong>
              </div>

              <p className="mt-4 min-h-[54px] text-[12px] leading-relaxed text-[#aeb5b4]">
                {trail.text}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="flex items-center gap-1.5 text-[11px] text-[#aeb5b4]">
                  <Clock3 size={12} />
                  {trail.duration}
                </span>

                <Link
                  href={`/dashboard/trails/${trail.slug}`}
                  aria-label={`View ${trail.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-0 bg-[#e9a127] text-[#121a18] transition hover:bg-[#f0b13d]"
                >
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
