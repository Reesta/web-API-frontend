import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getStayBySlugAction } from "@/lib/actions/stay-action";
import { Stay } from "@/lib/api/stays";
import StayBookingClient from "./StayBookingClient";

export default async function StayBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getStayBySlugAction(slug);
  const stay = result.success ? (result.data as Stay | null) : null;

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

      <StayBookingClient stay={stay} />
    </section>
  );
}
