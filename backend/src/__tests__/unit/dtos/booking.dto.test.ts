import { CreateBookingDTO, UpdateBookingDTO } from "../../../dtos/booking.dto";

const booking = { itemType: "stay", itemSlug: "mountain-lodge", itemTitle: "Mountain Lodge", amount: "NPR 5000", startDate: "2026-08-01", travelers: 1, fullName: "Test User", email: "test@example.com", phone: "9812345678" };

describe("booking DTO validation", () => {
  it("accepts a valid booking", () => expect(CreateBookingDTO.safeParse(booking).success).toBe(true));
  it("coerces travelers from a string", () => expect(CreateBookingDTO.parse({ ...booking, travelers: "2" }).travelers).toBe(2));
  it("rejects zero travelers", () => expect(CreateBookingDTO.safeParse({ ...booking, travelers: 0 }).success).toBe(false));
  it("rejects an invalid email", () => expect(CreateBookingDTO.safeParse({ ...booking, email: "bad" }).success).toBe(false));
  it("accepts a confirmed status update", () => expect(UpdateBookingDTO.safeParse({ status: "Confirmed" }).success).toBe(true));
  it("rejects an unknown booking status", () => expect(UpdateBookingDTO.safeParse({ status: "Paid" }).success).toBe(false));
});
