"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Edit3, Star, Trash2, Upload } from "lucide-react";
import { YetiTrekUser } from "@/lib/api/auth";
import { resolveImageUrl } from "@/lib/api/image-url";
import { Review, ReviewSummary } from "@/lib/api/reviews";
import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/lib/actions/review-action";

type SortOption = "newest" | "highest" | "lowest";

export default function StayReviews({
  staySlug,
  initialReviews,
  summary,
  currentUser,
}: {
  staySlug: string;
  initialReviews: Review[];
  summary: ReviewSummary;
  currentUser: YetiTrekUser | null;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [sort, setSort] = useState<SortOption>("newest");
  const [editing, setEditing] = useState<Review | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const myReview = currentUser
    ? reviews.find((review) => review.userId === currentUser.id)
    : null;

  const computedSummary = useMemo(() => {
    if (!reviews.length) return { averageRating: 0, totalReviews: 0 };
    const averageRating = Number(
      (
        reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      ).toFixed(1),
    );
    return { averageRating, totalReviews: reviews.length };
  }, [reviews]);

  const displaySummary = reviews.length === initialReviews.length ? summary : computedSummary;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);
    payload.set("staySlug", staySlug);
    payload.set("rating", String(rating));
    setError("");
    setMessage("");

    startTransition(async () => {
      const result = await createReviewAction(payload);
      if (!result.success || !result.data) {
        setError(result.message);
        return;
      }
      setReviews((current) => [result.data as Review, ...current]);
      setMessage(result.message || "Review submitted successfully");
      form.reset();
      setRating(5);
    });
  };

  const updateReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const payload = new FormData(event.currentTarget);
    payload.set("rating", String(rating));
    setError("");
    setMessage("");

    startTransition(async () => {
      const result = await updateReviewAction(editing.id, staySlug, payload);
      if (!result.success || !result.data) {
        setError(result.message);
        return;
      }
      setReviews((current) =>
        current.map((review) =>
          review.id === editing.id ? (result.data as Review) : review,
        ),
      );
      setEditing(null);
      setMessage(result.message || "Review updated successfully");
    });
  };

  const removeReview = (review: Review) => {
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await deleteReviewAction(review.id, staySlug);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setReviews((current) => current.filter((item) => item.id !== review.id));
      setMessage(result.message || "Review deleted successfully");
    });
  };

  const beginEdit = (review: Review) => {
    setEditing(review);
    setRating(review.rating);
    setError("");
    setMessage("");
  };

  return (
    <section className="rounded-[18px] border border-white/10 bg-[#0d1314] p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e9a127]">
            Guest reviews
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">Reviews & Ratings</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#a8b0af]">
            <Stars rating={displaySummary.averageRating} />
            <strong className="text-white">{displaySummary.averageRating.toFixed(1)}</strong>
            <span>{displaySummary.totalReviews} reviews</span>
          </div>
        </div>

        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8e9898]">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-11 rounded-lg border border-white/10 bg-[#11191b] px-3 text-sm font-bold normal-case tracking-normal text-white outline-none"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </label>
      </div>

      {message && (
        <p className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-5 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-white/10 bg-[#101719] p-5">
          {currentUser ? (
            myReview && !editing ? (
              <div>
                <h3 className="text-lg font-black text-white">You reviewed this stay</h3>
                <p className="mt-2 text-sm leading-6 text-[#a8b0af]">
                  Each traveler can write one review per stay. You can edit or delete
                  your review from its card.
                </p>
              </div>
            ) : (
              <ReviewForm
                key={editing?.id || "create-review"}
                onSubmit={editing ? updateReview : submitReview}
                rating={rating}
                setRating={setRating}
                isPending={isPending}
                submitText={editing ? "Update review" : "Submit review"}
                defaultReview={editing}
                onCancel={editing ? () => setEditing(null) : undefined}
              />
            )
          ) : (
            <div>
              <h3 className="text-lg font-black text-white">Log in to write a review</h3>
              <p className="mt-2 text-sm leading-6 text-[#a8b0af]">
                Guests can read every review, but only logged-in travelers can share
                their stay experience.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center rounded-lg bg-[#e9a127] px-4 text-sm font-black text-[#121a18]"
              >
                Log in
              </Link>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {sortedReviews.length ? (
            sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                canManage={currentUser?.id === review.userId}
                onEdit={() => beginEdit(review)}
                onDelete={() => removeReview(review)}
                isPending={isPending}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#101719] p-6 text-sm text-[#a8b0af]">
              No reviews yet. Be the first traveler to rate this stay.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewForm({
  onSubmit,
  rating,
  setRating,
  isPending,
  submitText,
  defaultReview,
  onCancel,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  rating: number;
  setRating: (rating: number) => void;
  isPending: boolean;
  submitText: string;
  defaultReview?: Review | null;
  onCancel?: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <p className="text-sm font-black text-white">Overall rating</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="text-[#e9a127] transition hover:scale-110"
              aria-label={`${value} star rating`}
            >
              <Star size={24} fill={value <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <input
        name="title"
        required
        minLength={3}
        maxLength={120}
        defaultValue={defaultReview?.title || ""}
        placeholder="Review title"
        className="h-12 rounded-lg border border-white/10 bg-[#0d1314] px-4 text-sm text-white outline-none placeholder:text-[#667170] focus:border-[#e9a127]/70"
      />
      <textarea
        name="text"
        required
        minLength={10}
        maxLength={1200}
        defaultValue={defaultReview?.text || ""}
        placeholder="Tell other trekkers what stood out..."
        rows={5}
        className="resize-none rounded-lg border border-white/10 bg-[#0d1314] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#667170] focus:border-[#e9a127]/70"
      />
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-[#0d1314] px-4 py-3 text-sm font-bold text-[#a8b0af] transition hover:border-[#e9a127]/50 hover:text-white">
        <Upload size={16} />
        Optional photos
        <input name="photos" type="file" accept="image/*" multiple className="sr-only" />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          disabled={isPending}
          className="h-12 rounded-lg bg-[#e9a127] px-5 text-sm font-black text-[#121a18] disabled:opacity-60"
        >
          {isPending ? "Saving..." : submitText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-lg border border-white/10 px-5 text-sm font-bold text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function ReviewCard({
  review,
  canManage,
  onEdit,
  onDelete,
  isPending,
}: {
  review: Review;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101719] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <strong className="text-white">{review.userName}</strong>
            <Stars rating={review.rating} compact />
          </div>
          <p className="mt-1 text-xs font-bold text-[#8e9898]">
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(review.createdAt))}
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#a8b0af] hover:text-white"
              aria-label="Edit review"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={onDelete}
              disabled={isPending}
              className="grid h-9 w-9 place-items-center rounded-lg border border-red-300/20 text-red-200 disabled:opacity-60"
              aria-label="Delete review"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      <h3 className="mt-4 text-lg font-black text-white">{review.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#a8b0af]">{review.text}</p>

      {review.photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {review.photos.map((photo) => (
            <div key={photo} className="relative h-24 overflow-hidden rounded-lg border border-white/10">
              <Image
                src={resolveImageUrl(photo)}
                alt={review.title}
                fill
                unoptimized
                sizes="120px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs font-bold text-[#8e9898]">
        {review.helpfulCount} travelers found this helpful
      </p>
    </article>
  );
}

function Stars({ rating, compact = false }: { rating: number; compact?: boolean }) {
  const rounded = Math.round(rating);

  return (
    <span className="flex items-center gap-0.5 text-[#e9a127]">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={compact ? 15 : 18}
          fill={value <= rounded ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}
