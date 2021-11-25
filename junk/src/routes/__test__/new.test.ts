import request from "supertest";
import { natsWrapper } from "common";

import { app } from "../../app";
import { Junk } from "../../models";

describe("new junk route handler", () => {
  it("has a route handler listening to /api/junk for post requests", async () => {
    const response = await request(app).post("/api/junk").send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/junk").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title: "", price: 10 })
      .expect(400);

    await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ price: 10 })
      .expect(400);
  });

  it("returns an error if an invalid price is provided", async () => {
    await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title: "Hello there", price: -10 })
      .expect(400);

    await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title: "Hello there" })
      .expect(400);
  });

  it("creates junk with valid inputs", async () => {
    let junks = await Junk.find({});
    expect(junks).toHaveLength(0);

    const title = "Hello there";
    await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title, price: 20 })
      .expect(201);

    junks = await Junk.find({});
    expect(junks).toHaveLength(1);
    expect(junks[0].price).toEqual(20);
    expect(junks[0].title).toEqual(title);
  });

  it("publishes an event", async () => {
    const title = "Hello there";
    await request(app)
      .post("/api/junk")
      .set("Cookie", global.signin())
      .send({ title, price: 20 })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
