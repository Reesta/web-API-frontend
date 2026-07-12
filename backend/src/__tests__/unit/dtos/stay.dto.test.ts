import { CreateStayDTO, UpdateStayDTO } from "../../../dtos/stay.dto";

const stay = { slug: "mountain-lodge", name: "Mountain Lodge", price: "NPR 5000", image: "/stay.jpg", galleryImages: [], distance: "2 km", description: "Warm rooms", experience: "Mountain views", amenities: ["Wifi"] };

describe("stay DTO validation", () => {
  it("accepts a valid stay", () => expect(CreateStayDTO.safeParse(stay).success).toBe(true));
  it("rejects a slug containing spaces", () => expect(CreateStayDTO.safeParse({ ...stay, slug: "mountain lodge" }).success).toBe(false));
  it("rejects a missing price", () => expect(CreateStayDTO.safeParse({ ...stay, price: "" }).success).toBe(false));
  it("rejects an empty amenity", () => expect(CreateStayDTO.safeParse({ ...stay, amenities: [""] }).success).toBe(false));
  it("provides default gallery and amenities", () => { const result = CreateStayDTO.parse({ ...stay, galleryImages: undefined, amenities: undefined }); expect(result.amenities).toEqual([]); });
  it("accepts a partial stay update", () => expect(UpdateStayDTO.safeParse({ name: "New Lodge" }).success).toBe(true));
});
