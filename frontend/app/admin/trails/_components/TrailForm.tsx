"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Mountain, Plus, Route, Timer, Trash2 } from "lucide-react";
import { AdminTrail } from "@/lib/api/admin/admin-trails";
import {
  createAdminTrailFormAction,
  updateAdminTrailFormAction,
} from "@/lib/actions/admin/admin-trail-action";
import { resolveImageUrl } from "@/lib/api/image-url";

type Props = { trail?: AdminTrail };

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]/70 focus:bg-[#09111f] focus:ring-4 focus:ring-[#e9a127]/10";

const textareaClass =
  "mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]/70 focus:bg-[#09111f] focus:ring-4 focus:ring-[#e9a127]/10";

type WaypointDraft = {
  day: string;
  title: string;
  altitude: string;
  text: string;
};

const createWaypointDrafts: WaypointDraft[] = [
  {
    day: "Day 1",
    title: "",
    altitude: "",
    text: "",
  },
  {
    day: "Day 2",
    title: "",
    altitude: "",
    text: "",
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function TrailForm({ trail }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [waypoints, setWaypoints] = useState<WaypointDraft[]>(
    trail?.waypoints?.length ? trail.waypoints : createWaypointDrafts,
  );
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(trail);
  const previewUrl = preview || resolveImageUrl(trail?.image);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const cleanWaypoints = waypoints.map((point) => ({
      day: point.day.trim(),
      title: point.title.trim(),
      altitude: point.altitude.trim(),
      text: point.text.trim(),
    }));

    const title = String(form.get("title") || "").trim();
    const duration = String(form.get("duration") || "").trim();
    const generatedSlug = isEditing && trail?.slug ? trail.slug : slugify(title);

    form.set("slug", generatedSlug);
    form.set("detailDuration", duration);
    form.set("waypoints", JSON.stringify(cleanWaypoints));
    const image = form.get("image");
    const hasImage = image instanceof File && image.size > 0;
    const requiredValues = [
      generatedSlug,
      title,
      form.get("altitude"),
      form.get("distance"),
      duration,
      form.get("text"),
    ].map((value) => String(value || "").trim());

    if (requiredValues.some((value) => !value)) {
      setError("All trail fields are required.");
      return;
    }
    if (
      cleanWaypoints.length < 2 ||
      cleanWaypoints.some(
        (point) => !point.day || !point.title || !point.altitude || !point.text,
      )
    ) {
      setError("Please add at least two complete waypoints.");
      return;
    }
    if (!isEditing && !hasImage) {
      setError("Please upload a trail image.");
      return;
    }
    if (!hasImage) {
      form.delete("image");
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateAdminTrailFormAction(trail!.id, form)
        : await createAdminTrailFormAction(form);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/admin/trails");
      router.refresh();
    });
  };

  const stats = useMemo(
    () => [
      { label: "Altitude", value: trail?.altitude || "Not set", icon: Mountain },
      { label: "Distance", value: trail?.distance || "Not set", icon: Route },
      { label: "Duration", value: trail?.duration || "Not set", icon: Timer },
    ],
    [trail],
  );

  const updateWaypoint = (
    index: number,
    field: keyof WaypointDraft,
    value: string,
  ) => {
    setWaypoints((current) =>
      current.map((point, pointIndex) =>
        pointIndex === index ? { ...point, [field]: value } : point,
      ),
    );
  };

  const addWaypoint = () => {
    setWaypoints((current) => [
      ...current,
      {
        day: `Day ${current.length + 1}`,
        title: "",
        altitude: "",
        text: "",
      },
    ]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints((current) =>
      current.length <= 2
        ? current
        : current.filter((_point, pointIndex) => pointIndex !== index),
    );
  };

  return (
    <form
      onSubmit={submit}
      autoComplete="off"
      className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1422]/95 shadow-2xl shadow-black/30"
    >
      <div className="grid gap-0 xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="border-b border-white/10 bg-[#08101c] p-5 xl:border-b-0 xl:border-r sm:p-6">
          <div className="mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e9a127]">
              {isEditing ? "Current media" : "Trail media"}
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              {isEditing ? "Preview and replace" : "Upload a cover image"}
            </h2>
          </div>

          <label className="group relative flex min-h-[360px] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.04]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={trail?.title || "Trail preview"}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="grid flex-1 place-items-center text-center text-slate-400">
                <span>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e9a127]/15 text-[#e9a127]">
                    <ImagePlus size={28} />
                  </span>
                  <span className="mt-4 block text-sm font-black text-white">Upload trail image</span>
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

          <div className="mt-4 grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <Icon size={17} className="text-[#e9a127]" />
                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="mt-1 truncate text-xs font-black text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="mb-5">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Basic details
          </p>
          <h2 className="mt-1 text-lg font-black text-white">Route information</h2>
        </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-black text-slate-200">
          Title
          <input name="title" defaultValue={trail?.title || ""} autoComplete="off" className={inputClass} required />
        </label>
        <label className="block text-sm font-black text-slate-200">
          Altitude
          <input name="altitude" defaultValue={trail?.altitude || ""} autoComplete="off" placeholder="5,364m" className={inputClass} required />
        </label>
        <label className="block text-sm font-black text-slate-200">
          Distance
          <input name="distance" defaultValue={trail?.distance || ""} autoComplete="off" placeholder="130km" className={inputClass} required />
        </label>
        <label className="block text-sm font-black text-slate-200">
          Duration
          <input name="duration" defaultValue={trail?.duration || ""} autoComplete="off" placeholder="8 Days" className={inputClass} required />
        </label>
        <label className="block text-sm font-black text-slate-200">
          Difficulty
          <select name="difficulty" defaultValue={trail?.difficulty || "Easy"} className={inputClass}>
            <option value="Easy">Easy</option>
            <option value="Mod">Mod</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
      </div>

        <label className="mt-5 block text-sm font-black text-slate-200">
          Description
          <textarea name="text" defaultValue={trail?.text || ""} autoComplete="off" className={textareaClass} required />
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-black text-white">Waypoints</h2>
            <p className="mt-1 text-xs text-slate-500">
              Add each major stop users should see in the trail timeline.
            </p>
          </div>
          <button
            type="button"
            onClick={addWaypoint}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e9a127]/35 bg-[#e9a127]/10 px-4 text-xs font-black text-[#e9a127] transition hover:bg-[#e9a127]/15"
          >
            <Plus size={15} />
            Add waypoint
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          {waypoints.map((point, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-[#08101c]/80 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e9a127] text-xs font-black text-[#14100a]">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeWaypoint(index)}
                  disabled={waypoints.length <= 2}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-300/20 text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Remove waypoint"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block text-xs font-black text-slate-300">
                  Day
                  <input
                    value={point.day}
                    onChange={(event) =>
                      updateWaypoint(index, "day", event.target.value)
                    }
                    placeholder="Day 1"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block text-xs font-black text-slate-300">
                  Stop title
                  <input
                    value={point.title}
                    onChange={(event) =>
                      updateWaypoint(index, "title", event.target.value)
                    }
                    placeholder="Namche Bazaar"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block text-xs font-black text-slate-300">
                  Altitude
                  <input
                    value={point.altitude}
                    onChange={(event) =>
                      updateWaypoint(index, "altitude", event.target.value)
                    }
                    placeholder="3,440m"
                    className={inputClass}
                    required
                  />
                </label>
              </div>

              <label className="mt-4 block text-xs font-black text-slate-300">
                Description
                <textarea
                  value={point.text}
                  onChange={(event) =>
                    updateWaypoint(index, "text", event.target.value)
                  }
                  placeholder="Describe what happens at this stop."
                  className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-[#070d18] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#e9a127]/70 focus:bg-[#09111f] focus:ring-4 focus:ring-[#e9a127]/10"
                  required
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.06]"
        >
          Cancel
        </button>
        <button
          disabled={isPending}
          className="rounded-xl bg-[#e9a127] px-5 py-3 text-sm font-black text-[#14100a] shadow-lg shadow-[#e9a127]/20 transition hover:bg-[#f5b94d] disabled:opacity-60"
        >
          {isPending ? "Saving..." : isEditing ? "Save changes" : "Create trail"}
        </button>
      </div>
        </div>
      </div>
    </form>
  );
}
