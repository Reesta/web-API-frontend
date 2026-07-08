import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Compass,
  MapPin,
  Mountain,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { getTrailsAction } from "@/lib/actions/trail-action";
import { Trail } from "@/lib/api/trails";
import { resolveImageUrl } from "@/lib/api/image-url";

const stats = [
  { label: "Saved routes", value: "06", icon: Compass },
  { label: "Planned days", value: "14", icon: CalendarDays },
  { label: "Safe support", value: "24/7", icon: ShieldCheck },
];

export default async function DashboardPage() {
  const response = await getCurrentUserAction();

  if (!response?.success || !response.data) {
    redirect("/login");
  }

  const user = response.data;
  const trailsResult = await getTrailsAction();
  const popularTreks: Trail[] =
    trailsResult.success && trailsResult.data ? trailsResult.data.slice(0, 3) : [];
  const planTrekHref = popularTreks[0]
    ? `/dashboard/trails/${popularTreks[0].slug}/plan`
    : "/dashboard/trails";

  return (
    <section className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="relative min-h-[360px] overflow-hidden rounded-[22px] bg-[linear-gradient(90deg,rgba(4,8,13,0.9),rgba(4,8,13,0.45)),url('/trail1.png')] bg-cover bg-center p-10 shadow-2xl shadow-black/30 max-[700px]:p-6">
          <div className="relative z-10 max-w-[650px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e9a127]/30 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#e9a127] backdrop-blur">
              <Sparkles size={14} />
              Trek dashboard
            </span>

            <h1 className="mt-7 text-[48px] font-black leading-tight text-white max-[700px]:text-4xl">
              Welcome back, {user.fullName}.
            </h1>

            <p className="mt-5 max-w-[560px] text-base leading-8 text-[#d7dfdf]">
              Plan routes, compare lodges, and keep your Himalayan adventure
              organized from one calm workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard/trails"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#e9a127] px-6 text-sm font-black text-[#121a18]"
              >
                Explore Trails
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/stay"
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-[#101719]/85 px-6 text-sm font-black text-white backdrop-blur transition hover:border-[#e9a127]"
              >
                Find Stays
              </Link>
            </div>
          </div>
        </div>

        <aside className="grid gap-4 rounded-[22px] border border-white/10 bg-[#0d1314] p-5 shadow-2xl shadow-black/20">
          <div className="rounded-2xl bg-[#11191b] p-5">
            <p className="text-xs font-black uppercase tracking-wider text-[#e9a127]">
              Next pick
            </p>
            <h2 className="mt-4 text-2xl font-black leading-tight text-white">
              Majestic High-Altitude Lodge
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#9aa4a3]">
              A warm mountain stay with comfort before the next trail day.
            </p>
            <Link
              href="/dashboard/stay/yeti-mountain-home"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e9a127] text-sm font-black text-[#121a18]"
            >
              View Details
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#11191b] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e9a127]/15 text-[#e9a127]">
                      <Icon size={18} />
                    </span>
                    <span className="text-sm font-semibold text-[#b9c2c1]">
                      {stat.label}
                    </span>
                  </div>
                  <strong className="text-lg font-black text-white">{stat.value}</strong>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="flex items-end justify-between gap-5 max-[700px]:flex-col max-[700px]:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#e9a127]">
            Recommended
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">Popular Treks</h2>
        </div>
        <Link
          href="/dashboard/trails"
          className="text-sm font-black text-[#e9a127] transition hover:text-[#f0b13d]"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        {popularTreks.length ? popularTreks.map((trek) => (
          <article
            key={trek.id}
            className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1314] shadow-xl shadow-black/20 transition hover:-translate-y-1"
          >
            <div
              className="relative h-[210px] bg-cover bg-center"
              style={{ backgroundImage: `url(${resolveImageUrl(trek.image)})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1314] via-transparent to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-[#e42d4f] px-3 py-1 text-[10px] font-black uppercase text-white">
                {trek.difficulty}
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-black text-white">{trek.title}</h3>
                <Link
                  href={`/dashboard/trails/${trek.slug}`}
                  aria-label={`Open ${trek.title}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9a127] text-[#121a18]"
                >
                  <ArrowRight size={15} />
                </Link>
              </div>

              <p className="mt-3 min-h-[52px] text-sm leading-6 text-[#aeb5b4]">
                {trek.text}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <Meta icon={<Mountain size={16} />} label="Altitude" value={trek.altitude} />
                <Meta icon={<Clock size={16} />} label="Duration" value={trek.duration} />
              </div>
            </div>
          </article>
        )) : (
          <div className="col-span-full rounded-[18px] border border-white/10 bg-[#0d1314] p-8 text-center text-[#aeb5b4]">
            No popular treks are available yet.
          </div>
        )}
      </div>

      <div className="grid gap-5 rounded-[22px] border border-white/10 bg-[#0d1314] p-6 shadow-xl shadow-black/20 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#e9a127]">
            Trek planning
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Ready to build a full route with lodges?
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#9aa4a3]">
            Open a trail detail page and plan each trekking day with suitable stays.
          </p>
        </div>
        <Link
          href={planTrekHref}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#e9a127] px-6 text-sm font-black text-[#121a18]"
        >
          Plan Trek
          <MapPin size={16} />
        </Link>
      </div>
    </section>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[#e9a127]">{icon}</div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-[#8c9695]">
        {label}
      </p>
      <strong className="mt-1 block text-sm font-black text-white">{value}</strong>
    </div>
  );
}
