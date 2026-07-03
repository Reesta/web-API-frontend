import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStaysAction } from "@/lib/actions/stay-action";
import { Stay } from "@/lib/api/stays";
import { resolveImageUrl } from "@/lib/api/image-url";
import { getAmenityIcon } from "@/lib/stay-amenities";

export default async function StayPage() {
  const result = await getStaysAction();
  const stays: Stay[] = result.success && result.data ? result.data : [];

  return (
    <section className="grid gap-6">
      <div className="flex min-h-[260px] items-end overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,rgba(2,9,16,0.06),rgba(2,9,16,0.82)),url('/stay.png')] bg-cover bg-[center_42%] px-14 py-10 max-[1000px]:min-h-[220px] max-[1000px]:p-7">
        <h1 className="max-w-[720px] text-[34px] font-black leading-tight text-white max-[1000px]:text-[30px]">
          Elite Stays in the High Himalayas
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-8 max-[1000px]:grid-cols-1 max-[1000px]:gap-5 min-[701px]:max-[1000px]:grid-cols-2">
        {stays.length ? stays.map((stay) => (
          <article key={stay.name} className="min-w-0 overflow-hidden rounded-[18px] bg-[#0d1314] shadow-2xl shadow-black/25">
            <div
              className="relative h-[148px] bg-cover bg-center after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#020910]/0 after:to-[#020910]/15"
              style={{ backgroundImage: `url(${resolveImageUrl(stay.image)})` }}
            >
              
            </div>

            <div className="flex min-h-[238px] flex-col px-7 pb-5 pt-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="max-w-[150px] text-[22px] font-medium leading-tight text-white max-[1000px]:max-w-none">
                  {stay.name}
                </h2>
                <div className="grid justify-items-end pt-1">
                  <strong className="text-[22px] font-black leading-none text-[#e9a127]">{stay.price}</strong>
                  <span className="mt-0.5 text-[10px] text-[#909794]">/night</span>
                </div>
              </div>

              <p className="mt-5 max-w-[220px] text-xs leading-relaxed text-[#b4bcb8] max-[1000px]:max-w-none">
                {stay.description}...
              </p>

              <div className="mt-auto flex items-end justify-between gap-4">
                <div className="flex min-h-[42px] items-end gap-3 text-[#e9a127]">
                  {stay.amenities.slice(0, 3).map((amenity) => {
                    const Icon = getAmenityIcon(amenity);

                    return (
                      <Icon key={`${stay.name}-${amenity}`} size={15} />
                    );
                  })}
                </div>
                <Link
                  href={`/dashboard/stay/${stay.slug}`}
                  aria-label={`View ${stay.name}`}
                  className="flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#e9a127] text-[#121a18]"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </article>
        )) : (
          <div className="col-span-full rounded-[18px] border border-white/10 bg-[#0d1314] p-8 text-center text-[#b4bcb8]">
            No stays are available yet.
          </div>
        )}
      </div>
    </section>
  );
}
