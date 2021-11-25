import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_PUBLIC_KEY) {
    throw new Error("JWT_PUBLIC_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    console.log("Connected to NATS");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

const close = async () => {
  let error = null;
  try {
    natsWrapper.client.close();
    console.log("NATS connection closed");

    await mongoose.disconnect();
    console.log("Disconnecting from MongoDB");
  } catch (err) {
    error = err;
  }
  console.log("Exiting");
  process.exit(error ? 1 : 0);
};

start();

process.on("SIGINT", close);
process.on("SIGTERM", close);
