import Link from "next/link";
import { BedDouble, Compass, Mountain, Route, SignalHigh } from "lucide-react";
import { notFound } from "next/navigation";
import { trails } from "../trail-data";

export default async function TrailDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trail = trails.find((item) => item.slug === slug);

  if (!trail) {
    notFound();
  }

  const stats = [
    { label: "Distance", value: trail.distance, icon: Route },
    { label: "Duration", value: trail.detailDuration, icon: Compass },
    { label: "Max Altitude", value: trail.altitude, icon: Mountain },
    { label: "Difficulty", value: trail.difficulty, icon: SignalHigh },
  ];

  return (
    <section className="grid gap-8">
      <div
        className="relative overflow-hidden rounded-[18px] bg-cover bg-center px-10 py-24 shadow-2xl shadow-black/25 max-[700px]:px-6"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(3, 8, 13, 0.72), rgba(3, 8, 13, 0.18)), url(${trail.image})`,
        }}
      >
        <h1 className="text-[34px] font-black text-white md:text-[42px]">
          {trail.title}
        </h1>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/trails/${trail.slug}/plan`}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#e9a127] px-6 text-sm font-black text-[#121a18]"
          >
            <Compass size={16} />
            Plan Your Full Trek
          </Link>

          <Link
            href="/dashboard/stay"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#11191b]/90 px-6 text-sm font-black text-white backdrop-blur transition hover:bg-[#172024]"
          >
            <BedDouble size={16} />
            Find Stays
          </Link>
        </div>
      </div>

      <div className="-mt-14 grid gap-5 px-8 md:grid-cols-4 max-[700px]:mt-0 max-[700px]:px-0">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-lg border border-white/5 bg-[#1f2221] p-6 shadow-xl shadow-black/25"
            >
              <Icon size={22} className="text-[#e9a127]" />
              <p className="mt-5 text-[11px] font-black uppercase tracking-wider text-[#8d9695]">
                {stat.label}
              </p>
              <strong className="mt-1 block text-xl font-black text-white">
                {stat.value}
              </strong>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-black text-white">Waypoints Timeline</h2>
          <div className="mt-6 border-l border-white/10 pl-7">
            {trail.waypoints.map((point, index) => (
              <div key={point.title} className="relative pb-9 last:pb-0">
                <span
                  className={`absolute -left-[35px] top-1 h-3 w-3 rounded-full ${
                    index === 0 ? "bg-[#e9a127] ring-4 ring-emerald-400/30" : "bg-[#626967]"
                  }`}
                />
                <p className="text-xs font-black text-[#e9a127]">{point.day}</p>
                <h3 className="mt-1 text-lg font-black text-white">{point.title}</h3>
                <p className="text-sm text-[#9aa4a3]">Altitude: {point.altitude}</p>
                <p className="mt-2 max-w-[330px] text-xs leading-5 text-[#697573]">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#1f2221] p-8 shadow-xl shadow-black/20">
          <h2 className="text-center text-2xl font-black text-white">
            Elevation Profile
          </h2>
          <div className="mt-7 h-[260px] rounded-lg border border-white/5 bg-[#202321] p-6">
            <div className="relative h-full overflow-hidden">
              <div className="absolute inset-x-0 top-1/4 h-px bg-white/10" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <div className="absolute inset-x-0 top-3/4 h-px bg-white/10" />
              <div
                className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-[#e9a127]/70 to-[#e9a127]/10"
                style={{
                  clipPath:
                    "polygon(0 86%, 10% 78%, 20% 82%, 30% 68%, 40% 58%, 52% 64%, 62% 48%, 72% 38%, 82% 44%, 92% 20%, 100% 10%, 100% 100%, 0 100%)",
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[78%] border-t-2 border-[#e9a127]"
                style={{
                  clipPath:
                    "polygon(0 86%, 10% 78%, 20% 82%, 30% 68%, 40% 58%, 52% 64%, 62% 48%, 72% 38%, 82% 44%, 92% 20%, 100% 10%, 100% 12%, 92% 22%, 82% 46%, 72% 40%, 62% 50%, 52% 66%, 40% 60%, 30% 70%, 20% 84%, 10% 80%, 0 88%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
