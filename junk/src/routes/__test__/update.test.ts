import request from "supertest";
import mongoose from "mongoose";
import { natsWrapper } from "common";

import { app } from "../../app";

describe("update junk router", () => {
  it("returns a 400 if the junk id is invalid", async () => {
    await request(app)
      .put("/api/junk/testId")
      .set("Cookie", global.signin())
      .send({ title: "Hello there", price: 20 })
      .expect(400);
  });

  it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/junk/${id}`)
      .set("Cookie", global.signin())
      .send({ title: "Hello there", price: 20 })
      .expect(404);
  });

  it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/junk/${id}`)
      .send({ title: "Hello there", price: 20 })
      .expect(401);
  });

  it("returns a 401 if the user does not own the junk", async () => {
    const title = "Hello there";
    const price = 20;

    const response = await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title, price });

    await request(app)
      .put(`/api/junk/${response.body.id}`)
      .set("Cookie", global.signin())
      .send({ title: "Taco made of nachos", price: 100 })
      .expect(401);

    const junkResponse = await request(app)
      .get(`/api/junk/${response.body.id}`)
      .send();
    expect(junkResponse.body.title).toEqual(title);
    expect(junkResponse.body.price).toEqual(price);
  });

  it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/junk")
      .set("Cookie", cookie)
      .send({ title: "Hello there", price: 20 });

    await request(app)
      .put(`/api/junk/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 20 })
      .expect(400);
    await request(app)
      .put(`/api/junk/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "Taco made of nachos", price: -10 })
      .expect(400);
  });

  it("updates the junk provided valid input", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/junk")
      .set("Cookie", cookie)
      .send({ title: "Hello there", price: 20 });

    const newTitle = "Taco made of nachos";
    const newPrice = 100;
    await request(app)
      .put(`/api/junk/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);

    const junkResponse = await request(app)
      .get(`/api/junk/${response.body.id}`)
      .send();
    expect(junkResponse.body.title).toEqual(newTitle);
    expect(junkResponse.body.price).toEqual(newPrice);
  });

  it("publishes an event", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/junk")
      .set("Cookie", cookie)
      .send({ title: "Hello there", price: 20 });

    const newTitle = "Taco made of nachos";
    const newPrice = 100;
    await request(app)
      .put(`/api/junk/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
