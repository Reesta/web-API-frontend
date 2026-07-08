import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  Home,
  Hourglass,
  Mail,
  MapPin,
  MessageSquareText,
  PencilLine,
  Phone,
  Route,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { ReactNode } from "react";
import { getAdminBookingAction } from "@/lib/actions/admin/admin-booking-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUserAction();
  if (!currentUser.success || !currentUser.data) redirect("/admin/login");
  if (currentUser.data.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const result = await getAdminBookingAction(id);
  if (!result.success || !result.data) notFound();
  const booking = result.data;
  const status = getStatusStyle(booking.status);
  const typeLabel = booking.itemType === "trail" ? "Trail" : "Stay";
  const dateRange = booking.endDate
    ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`
    : formatDate(booking.startDate);

  return (
    <main className="min-h-screen bg-[#050812] px-5 py-8 text-white sm:px-8 lg:py-10">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-[#e9a127]/50 hover:text-[#e9a127]"
        >
          <ArrowLeft size={16} />
          Back to bookings
        </Link>

        <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40">
          <section className="grid border-b border-white/10 lg:grid-cols-[1.45fr_0.85fr]">
            <div className="bg-[linear-gradient(135deg,#1c2535_0%,#0e1726_48%,#0d2c34_100%)] p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#e9a127] px-3 py-1.5 text-xs font-black text-[#151007]">
                  {typeLabel === "Trail" ? <Route size={14} /> : <Home size={14} />}
                  {typeLabel} booking
                </span>
                <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-black ${status.className}`}>
                  {status.icon}
                  {booking.status}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-none text-white sm:text-6xl">
                {booking.itemTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Booked by <strong className="text-white">{booking.fullName}</strong> for{" "}
                <strong className="text-white">{booking.travelers}</strong> traveler
                {booking.travelers === 1 ? "" : "s"}.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <HeroStat icon={<CalendarDays size={18} />} label="Travel date" value={dateRange} />
                <HeroStat icon={<CreditCard size={18} />} label="Total amount" value={booking.amount} accent />
                <HeroStat icon={<Clock3 size={18} />} label="Created" value={formatDateTime(booking.createdAt)} />
              </div>
            </div>

            <aside className="flex flex-col justify-between gap-8 bg-[#101827] p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-bold text-slate-400">Lead traveler</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#e9a127] text-xl font-black text-[#151007]">
                    {booking.fullName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black text-white">{booking.fullName}</p>
                    <p className="mt-1 truncate text-sm text-slate-400">{booking.email}</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/admin/bookings/${booking.id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:bg-[#f5b94d]"
              >
                <PencilLine size={17} />
                Edit booking
              </Link>
            </aside>
          </section>

          <section className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_22rem] lg:p-10">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e9a127]">
                    Booking overview
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">Traveler and trip details</h2>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                <DetailRow icon={<UserRound size={18} />} label="Traveler" value={booking.fullName} />
                <DetailRow icon={<Mail size={18} />} label="Email" value={booking.email} />
                <DetailRow icon={<Phone size={18} />} label="Phone" value={booking.phone} />
                <DetailRow icon={<UsersRound size={18} />} label="Travelers" value={String(booking.travelers)} />
                <DetailRow icon={<CalendarDays size={18} />} label="Start date" value={formatDate(booking.startDate)} />
                <DetailRow icon={<CalendarDays size={18} />} label="End date" value={booking.endDate ? formatDate(booking.endDate) : "Not set"} />
                <DetailRow icon={<MapPin size={18} />} label="Pickup city" value={booking.pickupCity || "Not set"} />
                <DetailRow icon={<MapPin size={18} />} label="Location" value={booking.location || "Not set"} />
              </div>
            </div>

            <aside className="self-start rounded-lg border border-white/10 bg-[#101827] p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Admin snapshot
              </p>

              <div className="mt-5 rounded-lg bg-[#e9a127] p-5 text-[#151007]">
                <div className="flex items-center gap-2 text-sm font-black">
                  <CreditCard size={18} />
                  Amount
                </div>
                <p className="mt-3 text-4xl font-black">{booking.amount}</p>
              </div>

              <dl className="mt-5 space-y-4 text-sm">
                <SummaryLine label="Booking type" value={typeLabel} />
                <SummaryLine label="Current status" value={booking.status} />
                <SummaryLine label="Created" value={formatDateTime(booking.createdAt)} />
              </dl>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-sm font-black text-slate-300">
                  <MessageSquareText size={18} className="text-cyan-200" />
                  Special request
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {booking.specialRequest || "No special request added."}
                </p>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-3 py-4 sm:grid-cols-[12rem_1fr] sm:items-center">
      <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
        <span className="text-[#e9a127]">{icon}</span>
        {label}
      </div>
      <p className="break-words text-base font-black text-white sm:text-right">{value}</p>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-black text-white">{value}</dd>
    </div>
  );
}

function HeroStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <p className={`mt-3 text-sm font-black ${accent ? "text-[#e9a127]" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function getStatusStyle(status: string) {
  if (status === "Confirmed") {
    return {
      className: "border-emerald-300/25 bg-emerald-400/15 text-emerald-100",
      icon: <BadgeCheck size={14} />,
    };
  }

  if (status === "Cancelled") {
    return {
      className: "border-red-300/25 bg-red-400/15 text-red-100",
      icon: <XCircle size={14} />,
    };
  }

  return {
    className: "border-amber-300/25 bg-amber-400/15 text-amber-100",
    icon: <Hourglass size={14} />,
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
