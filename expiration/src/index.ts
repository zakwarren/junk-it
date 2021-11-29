import { natsWrapper } from "common";

const start = async () => {
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
  } catch (err) {
    console.error(err);
  }
};

const close = async () => {
  let error = null;
  try {
    natsWrapper.client.close();
    console.log("NATS connection closed");
  } catch (err) {
    error = err;
  }
  console.log("Exiting");
  process.exit(error ? 1 : 0);
};

start();

process.on("SIGINT", close);
process.on("SIGTERM", close);
