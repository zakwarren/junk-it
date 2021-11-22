import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

describe("get specific junk route handler", () => {
  it("returns a 400 if the junk id is invalid", async () => {
    await request(app).get("/api/junk/testId").send().expect(400);
  });

  it("returns a 404 if the junk is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/junk/${id}`).send().expect(404);
  });

  it("returns the junk if the junk is found", async () => {
    const title = "Hello there";
    const price = 20;

    const response = await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);

    const junkResponse = await request(app)
      .get(`/api/junk/${response.body.id}`)
      .send()
      .expect(200);

    expect(junkResponse.body.title).toEqual(title);
    expect(junkResponse.body.price).toEqual(price);
  });
});
