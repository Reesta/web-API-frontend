import { CreateTrailDTO, UpdateTrailDTO } from "../../../dtos/trail.dto";

const trail = { slug: "annapurna-circuit", title: "Annapurna Circuit", altitude: "5,416m", distance: "160 km", duration: "12 days", detailDuration: "12 days / 11 nights", image: "/trail.jpg", difficulty: "Hard", text: "Classic trek", waypoints: [] };

describe("trail DTO validation", () => {
  it("accepts a valid trail", () => expect(CreateTrailDTO.safeParse(trail).success).toBe(true));
  it("rejects an uppercase slug", () => expect(CreateTrailDTO.safeParse({ ...trail, slug: "Bad-Slug" }).success).toBe(false));
  it("rejects an unsupported difficulty", () => expect(CreateTrailDTO.safeParse({ ...trail, difficulty: "Extreme" }).success).toBe(false));
  it("rejects a missing title", () => expect(CreateTrailDTO.safeParse({ ...trail, title: "" }).success).toBe(false));
  it("accepts a partial trail update", () => expect(UpdateTrailDTO.safeParse({ title: "New title" }).success).toBe(true));
  it("rejects an incomplete waypoint", () => expect(CreateTrailDTO.safeParse({ ...trail, waypoints: [{ day: "Day 1" }] }).success).toBe(false));
});
