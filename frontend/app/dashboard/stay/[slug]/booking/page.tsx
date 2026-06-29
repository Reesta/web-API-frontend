import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { stays } from "../../stay-data";

export default async function StayBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = stays.find((item) => item.slug === slug);

  if (!stay) {
    notFound();
  }

  return (
    <section className="grid gap-7">
      <Link
        href={`/dashboard/stay/${stay.slug}`}
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#e9a127] transition hover:text-[#f0b13d]"
      >
        <ArrowLeft size={16} />
        Back to Stay
      </Link>

      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#e9a127]">
          Lodge Booking
        </p>
        <h1 className="mt-2 text-[34px] font-black leading-tight text-white">
          Reserve {stay.name}
        </h1>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
        <form className="grid gap-5 rounded-[18px] border border-white/10 bg-[#0d1314] p-7 shadow-2xl shadow-black/25">
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={<UserRound size={16} />} label="Full Name" placeholder="Your name" />
            <Field icon={<Mail size={16} />} label="Email" placeholder="you@example.com" />
            <Field icon={<Phone size={16} />} label="Phone" placeholder="+977 98XXXXXXXX" />
            <Field icon={<CalendarDays size={16} />} label="Check-in Date" type="date" />
            <Field icon={<CalendarDays size={16} />} label="Check-out Date" type="date" />
            <Field label="Guests" type="number" placeholder="2" />
          </div>

          <label className="grid gap-2 text-sm font-bold text-white">
            Special Request
            <textarea
              rows={5}
              placeholder="Meal preference, arrival time, or room notes"
              className="resize-none rounded-lg border border-white/10 bg-[#11191b] px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-[#687271] focus:border-[#e9a127]"
            />
          </label>

          <button
            type="button"
            className="h-14 rounded-lg bg-[#e9a127] text-sm font-black text-[#121a18] shadow-xl shadow-[#e9a127]/20 transition hover:bg-[#f0b13d]"
          >
            Confirm Booking
          </button>
        </form>

        <aside className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1314] shadow-2xl shadow-black/25">
          <div className="relative h-[190px]">
            <Image
              src={stay.image}
              alt={stay.name}
              fill
              sizes="330px"
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-black text-white">{stay.name}</h2>
            <p className="mt-2 text-sm text-[#9aa4a3]">{stay.distance}</p>
            <div className="my-5 h-px bg-white/10" />
            <p className="text-[10px] font-black uppercase tracking-wider text-[#8e9898]">
              Estimated Price
            </p>
            <strong className="mt-2 block text-2xl font-black text-[#e9a127]">
              {stay.price}
            </strong>
            <span className="text-xs text-[#8e9898]">per night before taxes</span>
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
