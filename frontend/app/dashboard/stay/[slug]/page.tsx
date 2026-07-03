import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Headphones,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getStayBySlugAction } from "@/lib/actions/stay-action";
import { Stay } from "@/lib/api/stays";
import { resolveImageUrl } from "@/lib/api/image-url";
import { getAmenityIcon } from "@/lib/stay-amenities";

export default async function StayDetailPage({
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

  const galleryImages = stay.galleryImages?.length
    ? stay.galleryImages
    : [stay.image];

  return (
    <section className="grid gap-8">
      <Link
        href="/dashboard/stay"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#e9a127] transition hover:text-[#f0b13d]"
      >
        <ArrowLeft size={16} />
        Back to Lodges
      </Link>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <article className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1314] shadow-2xl shadow-black/30">
          <div className="relative h-[360px] overflow-hidden max-[700px]:h-[240px]">
            <Image
              src={resolveImageUrl(stay.image)}
              alt={stay.name}
              fill
              unoptimized
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1314]/80 via-transparent to-transparent" />
            
          </div>

          <div className="px-7 pb-7 pt-6 max-[700px]:px-5">
          <div className="flex items-start justify-between gap-6 max-[700px]:flex-col">
            <div>
              <h1 className="text-[34px] font-black leading-tight text-white">
                {stay.name}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-[#9aa4a3]">
                <MapPin size={13} />
                {stay.distance}
              </p>
            </div>

            <div className="text-right max-[700px]:text-left">
              <strong className="text-2xl font-black text-[#e9a127]">
                {stay.price}
              </strong>
              <span className="block text-[11px] text-[#8e9898]">/ night</span>
            </div>
          </div>

          <div className="my-7 h-px bg-white/10" />

          <div className="rounded-2xl border border-white/10 bg-[#101719] p-5">
            <h2 className="text-base font-black text-white">Amenities</h2>

            <div className="mt-6 grid grid-cols-4 divide-x divide-white/10 max-[700px]:grid-cols-2 max-[700px]:divide-x-0 max-[700px]:gap-5">
              {stay.amenities.map((amenity) => {
                const Icon = getAmenityIcon(amenity);

                return (
                  <div
                    key={amenity}
                    className="grid justify-items-center gap-2 px-4 text-center text-xs font-semibold text-white"
                  >
                    <Icon size={28} className="text-[#e9a127]" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="flex items-center gap-3 text-lg font-black text-white">
              <span className="text-[#e9a127]">▰</span>
              Experience
            </h2>
            <p className="mt-4 max-w-[720px] text-sm leading-7 text-[#a8b0af]">
              {stay.experience}
            </p>

            <div className="mt-6 grid grid-cols-4 gap-3 max-[700px]:grid-cols-2">
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className="relative h-[130px] overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={resolveImageUrl(image)}
                    alt={`${stay.name} gallery`}
                    fill
                    unoptimized
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          </div>
        </article>

        <aside className="sticky top-24 grid gap-5 max-xl:static">
          <div className="rounded-[18px] border border-white/10 bg-[#0d1314] p-6 shadow-2xl shadow-black/30">
          <div className="rounded-2xl border border-white/10 bg-[#11191b] p-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
              <p className="text-[10px] font-bold uppercase text-[#8e9898]">
                Check-in
              </p>
              <p className="mt-2 text-sm font-semibold text-white">24 Oct 2023</p>
              </div>
              <div>
              <p className="text-[10px] font-bold uppercase text-[#8e9898]">
                Check-out
              </p>
              <p className="mt-2 text-sm font-semibold text-white">27 Oct 2023</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#11191b] p-5">
            <p className="text-[10px] font-bold uppercase text-[#8e9898]">
              Total Estimate
            </p>
            <strong className="mt-2 block text-2xl font-black text-[#e9a127]">
              {stay.price}
            </strong>
            <span className="text-xs text-[#8e9898]">per night before taxes</span>
          </div>

          <Link
            href={`/dashboard/stay/${stay.slug}/booking`}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-lg border-0 bg-[#e9a127] text-sm font-black text-[#121a18] shadow-xl shadow-[#e9a127]/20 transition hover:bg-[#f0b13d]"
          >
            <CalendarDays size={16} />
            Book Now
          </Link>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-[#0d1314] p-6 shadow-2xl shadow-black/30">
            <h2 className="text-lg font-black text-white">Why book with us?</h2>
            <div className="mt-6 grid gap-5">
              <WhyItem icon={<Tag size={18} />} text="Best price guarantee" />
              <WhyItem icon={<Headphones size={18} />} text="Local support 24/7" />
              <WhyItem icon={<ShieldCheck size={18} />} text="Safe & secure booking" />
              <WhyItem icon={<Users size={18} />} text="Trusted by travelers" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function WhyItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 text-sm font-semibold text-white">
      <span className="text-[#e9a127]">{icon}</span>
      {text}
    </div>
  );
}
