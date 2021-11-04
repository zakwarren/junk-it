import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import {
  currentUserRouter,
  signinRouter,
  singoutRouter,
  signupRouter,
} from "./routes";
import { NotFoundError, errorHandler } from "common";

const app = express();
// trust proxy as behind nginx, so should trust its traffic
app.set("trust-proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
  })
);

const rootRoute = "/api/users";
app.use(rootRoute, currentUserRouter);
app.use(rootRoute, signinRouter);
app.use(rootRoute, singoutRouter);
app.use(rootRoute, signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
