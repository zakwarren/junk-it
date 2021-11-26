import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Junk, Order, OrderStatus } from "../../models";

describe("new order route handler", () => {
  it("has a route handler listening to /api/orders for post requests", async () => {
    const response = await request(app).post("/api/orders").send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/orders").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if the junk does not exist", async () => {
    const junkId = new mongoose.Types.ObjectId();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ junkId })
      .expect(404);
  });

  it("returns an error if the junk is already reserved", async () => {
    const junk = new Junk({ title: "Hello there", price: 20 });
    await junk.save();
    const order = new Order({
      junk,
      userId: "testing",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ junkId: junk.id })
      .expect(400);
  });

  it("reserves a junk", async () => {
    const junk = new Junk({ title: "Hello there", price: 20 });
    await junk.save();

    const order = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ junkId: junk.id })
      .expect(201);
    const exists = Order.findOne({ order });

    expect(exists).not.toBeNull();
  });
});
