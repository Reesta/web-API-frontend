import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
  HeartHandshake,
  MapPin,
  Mountain,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getBlogsAction } from "@/lib/actions/blog-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { Blog } from "@/lib/api/blogs";
import BlogCard from "../dashboard/blogs/_components/BlogCard";

const destinations = [
  {
    title: "Everest Base Camp",
    image: "/stay4.png",
    duration: "8 Days",
    level: "Hard",
    type: "High Altitude",
    text: "A legendary route with sweeping views of the Khumbu region.",
  },
  {
    title: "Annapurna Sanctuary",
    image: "/home.png",
    duration: "7 Days",
    level: "Moderate",
    type: "Mountain Trail",
    text: "A scenic trail surrounded by forests, villages, and high peaks.",
  },
  {
    title: "Gokyo Valley",
    image: "/login.png",
    duration: "5 Days",
    level: "Hard",
    type: "Lake Valley",
    text: "Peaceful lakes, dramatic ridgelines, and wide Himalayan views.",
  },
  {
    title: "Langtang Valley",
    image: "/signup.png",
    duration: "6 Days",
    level: "Easy",
    type: "Village Trail",
    text: "A beautiful valley trek with culture, forests, and mountain views.",
  },
];

const stats = [
  { icon: Users, value: "12,000+", label: "Happy Trekkers" },
  { icon: Mountain, value: "150+", label: "Expeditions" },
  { icon: ShieldCheck, value: "98%", label: "Success Rate" },
  { icon: Headphones, value: "24/7", label: "Support" },
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "Safety First Planning",
    text: "Compare altitude, difficulty, and duration before choosing your route.",
  },
  {
    icon: MapPin,
    title: "Local Route Insight",
    text: "Plan with useful information designed for Nepal trekking conditions.",
  },
  {
    icon: HeartHandshake,
    title: "Traveler Focused Care",
    text: "Get clear guidance for routes, stays, and your next travel step.",
  },
];

export default async function Home() {
  const [blogResult, currentUser] = await Promise.all([
    getBlogsAction(),
    getCurrentUserAction(),
  ]);
  const blogs: Blog[] = blogResult.success && blogResult.data ? blogResult.data : [];
  const homepageBlogs = blogs.slice(0, 3);
  const isAuthenticated = Boolean(currentUser.success && currentUser.data);
  const userKey = currentUser.success && currentUser.data
    ? currentUser.data.id || currentUser.data.email
    : undefined;

  return (
    <div className="bg-[#070b13] text-white">
      <section id="explore" className="relative min-h-screen scroll-mt-[76px] pt-[76px]">
        <Image
          src="/home.png"
          alt="Nepal mountain lodge"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#03070d]/95 via-[#07101a]/80 to-[#120b05]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] w-[min(1180px,calc(100%_-_120px))] items-center py-24 max-[1000px]:w-[min(100%-40px,1180px)]">
          <div className="max-w-3xl">
            <Eyebrow text="Your journey. Our expertise." />

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
              Explore Nepal with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Discover Himalayan trails, compare mountain stays, and plan your
              next adventure with a simple trekking companion.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-full bg-[#D89A2B] px-8 py-4 text-sm font-black text-black shadow-xl shadow-[#D89A2B]/20 transition hover:-translate-y-0.5 hover:bg-[#e7ad3e]"
              >
                Start Your Journey
              </Link>

              <Link
                href="#destinations"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-8 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-[#D89A2B]"
              >
                View Destinations <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#090f18] py-24">
        <div className="mx-auto grid w-[min(1180px,calc(100%_-_120px))] gap-8 sm:grid-cols-2 lg:grid-cols-4 max-[1000px]:w-[min(100%-40px,1180px)]">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#101822] p-8 text-center shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#D89A2B]/40"
              >
                <Icon size={34} className="mx-auto text-[#D89A2B]" />
                <h3 className="mt-5 text-3xl font-black">{stat.value}</h3>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="destinations" className="scroll-mt-[76px] bg-[#070b13] py-32">
        <div className="mx-auto w-[min(1180px,calc(100%_-_120px))] max-[1000px]:w-[min(100%-40px,1180px)]">
          <div className="mx-auto max-w-3xl text-center">
            <EyebrowCenter text="Destinations" />

            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
              Popular routes for your next trek
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-400">
              Choose scenic Himalayan routes with clear difficulty and duration
              details before you travel.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-[1180px] gap-7 md:grid-cols-2 xl:grid-cols-4">
            {destinations.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101822] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-[#D89A2B]/40"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  <span className="absolute left-5 top-5 rounded-full bg-[#D89A2B] px-4 py-1 text-xs font-black text-black shadow-lg shadow-black/30">
                    {item.level}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-black">{item.title}</h3>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-2">
                      <Clock size={15} className="text-[#D89A2B]" />
                      {item.duration}
                    </span>

                    <span className="flex items-center gap-2">
                      <MapPin size={15} className="text-[#D89A2B]" />
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {item.text}
                  </p>

                  <Link
                    href="/login"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#D89A2B] transition hover:text-[#e7ad3e]"
                  >
                    Plan this route <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blogs" className="scroll-mt-[76px] border-y border-white/10 bg-[#090f18] py-32">
        <div className="mx-auto w-[min(1180px,calc(100%_-_120px))] max-[1000px]:w-[min(100%-40px,1180px)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <Eyebrow text="Trek journal" />
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                Read trekking guides before you login
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-400">
                Browse safety tips, culture notes, weather updates, gear advice,
                news, and community stories from the Yeti Trek journal.
              </p>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-[#D89A2B] px-6 py-3 text-sm font-black text-black transition hover:bg-[#e7ad3e]"
            >
              Browse all blogs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {homepageBlogs.length ? homepageBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                basePath="/blogs"
                isAuthenticated={isAuthenticated}
                userKey={userKey}
              />
            )) : (
              <div className="rounded-2xl border border-white/10 bg-[#101822] p-8 text-slate-400 md:col-span-2 xl:col-span-3">
                Blog articles will appear here after admins publish them.
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-[76px] border-y border-white/10 bg-[#090f18] py-32">
        <div className="mx-auto grid w-[min(1180px,calc(100%_-_120px))] items-center gap-24 lg:grid-cols-2 max-[1000px]:w-[min(100%-40px,1180px)]">
          <div className="relative h-[520px] overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/30">
            <Image
              src="/stay.png"
              alt="Mountain stay in Nepal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#D89A2B]">
                Built for Nepal
              </p>
              <p className="mt-2 text-xl font-black text-white">
                Trails, stays, and plans in one place
              </p>
            </div>
          </div>

          <div>
            <Eyebrow text="About us" />

            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-tight md:text-5xl">
              A trekking companion made for Nepal adventures
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
              Yeti Trek brings trail discovery, mountain stays, and useful
              planning details into one simple experience so travelers can
              prepare with confidence.
            </p>

            <div className="mt-10 grid gap-4">
              <AboutPoint text="Curated routes for every level" />
              <AboutPoint text="Carefully selected mountain stays" />
              <AboutPoint text="Simple planning from start to finish" />
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="scroll-mt-[76px] py-32">
        <div className="mx-auto w-[min(1180px,calc(100%_-_120px))] max-[1000px]:w-[min(100%-40px,1180px)]">
          <div className="mx-auto max-w-3xl text-center">
            <EyebrowCenter text="Why choose us" />

            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
              Professional planning without the complexity
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-400">
              We keep trekking preparation simple, visual, and useful from your
              first route search to your final booking decision.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <article
                  key={reason.title}
                  className="rounded-2xl border border-white/10 bg-[#101822] p-8 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#D89A2B]/40"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D89A2B]/15 text-[#D89A2B]">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-7 text-xl font-black">{reason.title}</h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {reason.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-[2px] w-10 bg-[#D89A2B]" />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D89A2B]">
        {text}
      </p>
    </div>
  );
}

function EyebrowCenter({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-[2px] w-10 bg-[#D89A2B]" />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D89A2B]">
        {text}
      </p>
      <span className="h-[2px] w-10 bg-[#D89A2B]" />
    </div>
  );
}

function AboutPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#101822] p-5 shadow-lg shadow-black/10">
      <CheckCircle2 size={21} className="shrink-0 text-[#D89A2B]" />
      <span className="text-sm font-bold text-slate-200">{text}</span>
    </div>
  );
}
