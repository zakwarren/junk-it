import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT_PRIVATE_KEY must be defined");
  }
  if (!process.env.JWT_PUBLIC_KEY) {
    throw new Error("JWT_PUBLIC_KEY must be defined");
  }

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

process.on("SIGINT", async () => {
  let error = null;
  try {
    await mongoose.disconnect();
    console.log("Disconnecting from MongoDB");
  } catch (err) {
    error = err;
  }
  console.log("Exiting");
  process.exit(error ? 1 : 0);
});
