import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "common";

import { createJunkRouter } from "./routes";

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
app.use(currentUser);

const rootRoute = "/api/junk";
app.use(rootRoute, createJunkRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
