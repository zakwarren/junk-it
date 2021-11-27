import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, JunkCreatedEvent } from "common";

import { JunkCreatedListener } from "../listeners";
import { Junk } from "../../models";

const setup = () => {
  const listener = new JunkCreatedListener(natsWrapper.client);
  const data: JunkCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "Hello there",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };
  return { listener, data, msg };
};

describe("junk created listener", () => {
  it("creates and saves a junk", async () => {
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);

    const junk = await Junk.findById(data.id);

    expect(junk).not.toBeNull();
    expect(junk?.title).toEqual(data.title);
    expect(junk?.price).toEqual(data.price);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
