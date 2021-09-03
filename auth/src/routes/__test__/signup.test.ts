import request from "supertest";

import { app } from "../../app";

describe("signup route", () => {
  it("should return a 201 on successful signup", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });

  it("should return a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test",
        password: "password",
      })
      .expect(400);
  });

  it("should return a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "p",
      })
      .expect(400);
  });

  it("should return a 400 without either email or password", async () => {
    return request(app).post("/api/users/signup").send({}).expect(400);
  });

  it("should not allow duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("should set a cookie after a successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
