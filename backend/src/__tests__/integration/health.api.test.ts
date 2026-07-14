import request from "supertest";
import app from "../../app";

describe("API health endpoint", () => {
  it("returns the running message as JSON", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.type).toContain("json");
    expect(response.body.message).toContain("API is running");
  });
});
