import request from "supertest";
import app from "../../app";

describe("API not-found handling", () => {
  it("returns the standard response for an unknown endpoint", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: "API route not found" });
  });
});
