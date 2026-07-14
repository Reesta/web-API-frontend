import { CreateBlogCommentDTO, CreateBlogDTO, SubmitStoryDTO, UpdateBlogDTO } from "../../../dtos/blog.dto";

const blog = { slug: "everest-guide", title: "Everest Guide", description: "A useful trek guide", content: "Detailed trekking content for visitors.", coverImage: "/blog.jpg", category: "Trek Guides", authorName: "Test Author", readingTime: "5 min" };

describe("blog DTO validation", () => {
  it("accepts a valid blog", () => expect(CreateBlogDTO.safeParse(blog).success).toBe(true));
  it("defaults a blog to draft", () => expect(CreateBlogDTO.parse(blog).status).toBe("draft"));
  it("rejects a short description", () => expect(CreateBlogDTO.safeParse({ ...blog, description: "short" }).success).toBe(false));
  it("accepts a partial blog update", () => expect(UpdateBlogDTO.safeParse({ featured: true }).success).toBe(true));
  it("defaults a submitted story to pending user content", () => { const result = SubmitStoryDTO.parse({ ...blog, category: "User Stories", relatedTrailSlugs: [] }); expect(result.source).toBe("user"); expect(result.status).toBe("pending"); });
  it("rejects a one-character comment", () => expect(CreateBlogCommentDTO.safeParse({ authorName: "User", text: "x" }).success).toBe(false));
});
