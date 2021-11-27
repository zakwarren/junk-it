import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, JunkUpdatedEvent } from "common";

import { JunkUpdatedListener } from "../listeners";
import { Junk } from "../../models";

const setup = async () => {
  const listener = new JunkUpdatedListener(natsWrapper.client);

  const junk = new Junk({ title: "Hello there", price: 20 });
  await junk.save();

  const data: JunkUpdatedEvent["data"] = {
    id: junk.id,
    version: junk.version + 1,
    title: "Taco made of nachos",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, junk };
};

describe("junk updated listener", () => {
  it("finds, updates, and saves a junk", async () => {
    const { listener, data, msg, junk } = await setup();
    await listener.onMessage(data, msg);

    const updatedJunk = await Junk.findById(junk.id);

    expect(updatedJunk?.title).toEqual(data.title);
    expect(updatedJunk?.price).toEqual(data.price);
    expect(updatedJunk?.version).toEqual(data.version);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("does not call ack if the event has a skipped version", async () => {
    const { listener, data, msg } = await setup();
    data.version = 10;

    await expect(listener.onMessage(data, msg)).rejects.toThrow();

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
