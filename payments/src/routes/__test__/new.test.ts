import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "common";

import { app } from "../../app";
import { Order } from "../../models";

describe("new charge route handler", () => {
  it("has a route handler listening to /api/payments for post requests", async () => {
    const response = await request(app).post("/api/payments").send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/payments").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns a 404 when purchasing an order that does not exist", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({
        token: "abc",
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it("returns a 404 when purchasing an order doesn't belong to the user", async () => {
    const order = new Order({
      userId: "123",
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({ token: "abc", orderId: order.id })
      .expect(404);
  });

  it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = new Order({
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({ token: "abc", orderId: order.id })
      .expect(400);
  });
});
