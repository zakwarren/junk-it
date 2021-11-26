import request from "supertest";

import { app } from "../../app";
import { Junk, Order } from "../../models";

const buildJunk = async () => {
  const junk = new Junk({ title: "Hello there", price: 20 });
  return await junk.save();
};

describe("list order route handler", () => {
  it("fetches orders for a particular user", async () => {
    const junkOne = await buildJunk();
    const junkTwo = await buildJunk();
    const junkThree = await buildJunk();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
      .post("/api/orders")
      .set("Cookie", userOne)
      .send({ junkId: junkOne.id })
      .expect(201);

    const { body: orderOne } = await request(app)
      .post("/api/orders")
      .set("Cookie", userTwo)
      .send({ junkId: junkTwo.id })
      .expect(201);
    const { body: orderTwo } = await request(app)
      .post("/api/orders")
      .set("Cookie", userTwo)
      .send({ junkId: junkThree.id })
      .expect(201);

    const { body: orderList } = await request(app)
      .get("/api/orders")
      .set("Cookie", userTwo)
      .expect(200);

    expect(orderList).toHaveLength(2);
    expect(orderList[0].id).toEqual(orderOne.id);
    expect(orderList[1].id).toEqual(orderTwo.id);
    expect(orderList[0].junk.id).toEqual(junkTwo.id);
    expect(orderList[1].junk.id).toEqual(junkThree.id);
  });
});
