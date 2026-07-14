import request from "supertest";
import app from "../../app";

describe("API CORS middleware", () => {
  it("answers a browser preflight request", async () => {
    const response = await request(app)
      .options("/api/v1/trails")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "GET");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toContain("GET");
  });
});
