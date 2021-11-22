import request from "supertest";

import { app } from "../../app";

const createJunk = () => {
  return request(app)
    .post("/api/junk")
    .set("Cookie", global.signin())
    .send({ title: "Hello there", price: 20 });
};

describe("get all junk route", () => {
  it("can fetch a list of junk", async () => {
    await createJunk();
    await createJunk();
    await createJunk();

    const response = await request(app).get("/api/junk").send().expect(200);

    expect(response.body).toHaveLength(3);
  });
});
