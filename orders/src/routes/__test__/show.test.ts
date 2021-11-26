import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Junk } from "../../models";

describe("show order route handler", () => {
  it("can only be accessed if the user is signed in", async () => {
    await request(app).get("/api/orders/testId").send({}).expect(401);
  });

  it("returns a 400 if the order id is invalid", async () => {
    await request(app)
      .get("/api/orders/testId")
      .set("Cookie", global.signin())
      .send()
      .expect(400);
  });

  it("returns a 404 if the order is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .get(`/api/orders/${id}`)
      .set("Cookie", global.signin())
      .send()
      .expect(404);
  });

  it("returns an error if one user tries to fetch another user's order", async () => {
    const junk = new Junk({ title: "Hello there", price: 20 });
    await junk.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ junkId: junk.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", global.signin())
      .send()
      .expect(404);
  });

  it("fetches the order", async () => {
    const junk = new Junk({ title: "Hello there", price: 20 });
    await junk.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ junkId: junk.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });
});
