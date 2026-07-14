import { AdminUpdateReviewDTO, CreateReviewDTO, UpdateReviewDTO } from "../../../dtos/review.dto";

const review = { staySlug: "mountain-lodge", rating: 5, title: "Great stay", text: "The lodge was warm and welcoming." };

describe("review DTO validation", () => {
  it("accepts a valid review", () => expect(CreateReviewDTO.safeParse(review).success).toBe(true));
  it("coerces a string rating", () => expect(CreateReviewDTO.parse({ ...review, rating: "4" }).rating).toBe(4));
  it("rejects a rating above five", () => expect(CreateReviewDTO.safeParse({ ...review, rating: 6 }).success).toBe(false));
  it("rejects review text under ten characters", () => expect(CreateReviewDTO.safeParse({ ...review, text: "Too short" }).success).toBe(false));
  it("accepts a partial review update", () => expect(UpdateReviewDTO.safeParse({ rating: 3 }).success).toBe(true));
  it("rejects a negative helpful count", () => expect(AdminUpdateReviewDTO.safeParse({ helpfulCount: -1 }).success).toBe(false));
});
