import express, { json } from "express";

import {
  currentUserRouter,
  signinRouter,
  singoutRouter,
  signupRouter,
} from "./routes";
import { errorHandler } from "./middleware";

const app = express();
app.use(json());

const rootRoute = "/api/users";
app.use(rootRoute, currentUserRouter);
app.use(rootRoute, signinRouter);
app.use(rootRoute, singoutRouter);
app.use(rootRoute, signupRouter);

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
