import request from "supertest";
import app from "../../app";

describe("API URL-encoded middleware", () => {
  it("handles a URL-encoded request and returns the standard 404", async () => {
    const response = await request(app)
      .post("/api/v1/unknown-form-route")
      .type("form")
      .send({ example: "payload" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("API route not found");
  });
});
