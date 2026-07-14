import request from "supertest";
import app from "../../app";

describe("API JSON middleware", () => {
  it("returns a JSON 404 response after parsing a JSON request", async () => {
    const response = await request(app)
      .post("/api/v1/unknown-json-route")
      .send({ example: "payload" });

    expect(response.status).toBe(404);
    expect(response.type).toContain("json");
    expect(response.body.success).toBe(false);
  });
});
