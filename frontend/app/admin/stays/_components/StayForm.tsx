"use client";

import Image from "next/image";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { AdminStay } from "@/lib/api/admin/admin-stays";
import {
  createAdminStayFormAction,
  updateAdminStayFormAction,
} from "@/lib/actions/admin/admin-stay-action";
import { resolveImageUrl } from "@/lib/api/image-url";
import { amenityOptions } from "@/lib/stay-amenities";

type Props = { stay?: AdminStay };

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]/70 focus:ring-4 focus:ring-[#e9a127]/10";
const textareaClass =
  "mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]/70 focus:ring-4 focus:ring-[#e9a127]/10";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function StayForm({ stay }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    stay?.amenities?.length ? stay.amenities : [],
  );
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(stay);
  const previewUrl = preview || resolveImageUrl(stay?.image);
  const existingGallery = stay?.galleryImages || [];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    form.set("slug", isEditing && stay?.slug ? stay.slug : slugify(name));
    form.set("amenities", JSON.stringify(selectedAmenities));

    const image = form.get("image");
    const hasImage = image instanceof File && image.size > 0;
    const requiredValues = [
      name,
      form.get("price"),
      form.get("distance"),
      form.get("description"),
      form.get("experience"),
    ].map((value) => String(value || "").trim());

    if (requiredValues.some((value) => !value)) {
      setError("All stay fields are required.");
      return;
    }
    if (!selectedAmenities.length) {
      setError("Please choose at least one amenity.");
      return;
    }
    if (!isEditing && !hasImage) {
      setError("Please upload a stay image.");
      return;
    }
    if (!hasImage) form.delete("image");
    form.delete("galleryImages");
    galleryFiles.forEach((file) => form.append("galleryImages", file));
    if (!galleryFiles.length && isEditing) {
      form.set("galleryImages", JSON.stringify(existingGallery));
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateAdminStayFormAction(stay!.id, form)
        : await createAdminStayFormAction(form);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/admin/stays");
      router.refresh();
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  };

  return (
    <form onSubmit={submit} autoComplete="off" className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1422]/95 shadow-2xl shadow-black/30">
      <div className="grid xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="border-b border-white/10 bg-[#08101c] p-5 xl:border-b-0 xl:border-r sm:p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e9a127]">
            {isEditing ? "Current media" : "Stay media"}
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            {isEditing ? "Preview and replace" : "Upload a lodge image"}
          </h2>

          <label className="group relative mt-5 flex min-h-[360px] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.04]">
            {previewUrl ? (
              <Image src={previewUrl} alt={stay?.name || "Stay preview"} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
            ) : (
              <span className="grid flex-1 place-items-center text-center text-slate-400">
                <span>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e9a127]/15 text-[#e9a127]">
                    <ImagePlus size={28} />
                  </span>
                  <span className="mt-4 block text-sm font-black text-white">Upload stay image</span>
                  <span className="mt-1 block text-xs text-slate-500">JPG, PNG, or WEBP up to 5 MB</span>
                </span>
              </span>
            )}
            <input
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : "");
              }}
            />
            <span className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-2 text-xs font-black text-white backdrop-blur">
              {previewUrl ? "Change image" : "Choose image"}
            </span>
          </label>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm font-black text-white">Gallery images</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Add extra photos for the Experience gallery.
            </p>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#070d18] px-4 py-4 text-sm font-black text-[#e9a127] transition hover:border-[#e9a127]/50">
              <ImagePlus size={18} />
              Choose gallery photos
              <input
                name="galleryImages"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  setGalleryFiles((current) => [...current, ...files].slice(0, 8));
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(galleryFiles.length
                ? galleryFiles.map((file) => URL.createObjectURL(file))
                : existingGallery.map((image) => resolveImageUrl(image))
              ).slice(0, 8).map((image, index) => (
                <div key={`${image}-${index}`} className="relative h-20 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                  <Image src={image} alt="Stay gallery preview" fill unoptimized className="object-cover" />
                  {galleryFiles.length ? (
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryFiles((current) =>
                          current.filter((_file, fileIndex) => fileIndex !== index),
                        )
                      }
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white backdrop-blur"
                      aria-label="Remove gallery image"
                    >
                      <X size={13} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {galleryFiles.length
                ? `${galleryFiles.length} selected. You can upload up to 8.`
                : "Select 2-3 images together or add them one by one."}
            </p>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Basic details</p>
            <h2 className="mt-1 text-lg font-black text-white">Stay information</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-black text-slate-200">Name<input name="name" defaultValue={stay?.name || ""} className={inputClass} required /></label>
              <label className="block text-sm font-black text-slate-200">Price<input name="price" defaultValue={stay?.price || ""} placeholder="NPR 12,500" className={inputClass} required /></label>
              <label className="block text-sm font-black text-slate-200 md:col-span-2">Distance / Location<input name="distance" defaultValue={stay?.distance || ""} placeholder="0.4 km from Thorong La Pass Route" className={inputClass} required /></label>
            </div>
            <label className="mt-5 block text-sm font-black text-slate-200">Short description<textarea name="description" defaultValue={stay?.description || ""} className={textareaClass} required /></label>
            <label className="mt-5 block text-sm font-black text-slate-200">Experience<textarea name="experience" defaultValue={stay?.experience || ""} className={textareaClass} required /></label>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <h2 className="text-sm font-black text-white">Amenities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#08101c]/80 px-4 py-3 text-sm font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="h-4 w-4 accent-[#e9a127]"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => router.back()} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.06]">Cancel</button>
            <button disabled={isPending} className="rounded-xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:bg-[#f5b94d] disabled:opacity-60">
              {isPending ? "Saving..." : isEditing ? "Save changes" : "Create stay"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
