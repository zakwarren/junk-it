import express, { json } from "express";
import "express-async-errors";
import mongoose from "mongoose";

import {
  currentUserRouter,
  signinRouter,
  singoutRouter,
  signupRouter,
} from "./routes";
import { NotFoundError } from "./errors";
import { errorHandler } from "./middleware";

const app = express();
app.use(json());

const rootRoute = "/api/users";
app.use(rootRoute, currentUserRouter);
app.use(rootRoute, signinRouter);
app.use(rootRoute, singoutRouter);
app.use(rootRoute, signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-service:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

start();
