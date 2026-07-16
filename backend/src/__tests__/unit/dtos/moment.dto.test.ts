import { CreateMomentDTO, UpdateMomentDTO } from "../../../dtos/moment.dto";

const validMoment = {
  title: "Annapurna sunrise",
  caption: "A beautiful morning on the Annapurna trail.",
  location: "Annapurna Base Camp",
  trailSlug: "annapurna-base-camp",
};

describe("moment DTO validation", () => {
  it("accepts valid moment details", () => {
    expect(CreateMomentDTO.safeParse(validMoment).success).toBe(true);
  });

  it("accepts a moment without an optional trail", () => {
    const { trailSlug, ...momentWithoutTrail } = validMoment;
    expect(CreateMomentDTO.safeParse(momentWithoutTrail).success).toBe(true);
  });

  it("rejects a title that is too short", () => {
    expect(CreateMomentDTO.safeParse({ ...validMoment, title: "A" }).success).toBe(false);
  });

  it("rejects a caption that is too long", () => {
    expect(
      CreateMomentDTO.safeParse({ ...validMoment, caption: "a".repeat(1001) }).success,
    ).toBe(false);
  });

  it("accepts a partial moment update", () => {
    expect(UpdateMomentDTO.safeParse({ location: "Everest Base Camp" }).success).toBe(true);
  });
});
