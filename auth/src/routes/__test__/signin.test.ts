import request from "supertest";

import { app } from "../../app";

describe("signin route", () => {
  it("should return a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({ email: "test", password: "password" })
      .expect(400);
  });

  it("should return a 400 with no password", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com" })
      .expect(400);
  });

  it("should fail when an email that does not exist is supplied", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(400);
  });

  it("should fail when an incorrect password is supplied", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    return request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "testing123" })
      .expect(400);
  });

  it("should respond with a cookie when given valid credentials", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
