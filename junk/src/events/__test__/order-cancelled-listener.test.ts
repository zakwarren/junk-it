import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, OrderCancelledEvent } from "common";

import { OrderCancelledListener } from "../listeners";
import { Junk } from "../../models";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const junk = new Junk({
    title: "Hello there",
    price: 20,
    userId: "123",
  });
  junk.set({ orderId });
  await junk.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    junk: { id: junk.id },
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, junk, orderId };
};

describe("order cancelled listener", () => {
  it("updates the junk", async () => {
    const { listener, data, msg, junk } = await setup();
    await listener.onMessage(data, msg);

    const updatedJunk = await Junk.findById(junk.id);
    expect(updatedJunk?.orderId).not.toBeDefined();
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("publishes an event", async () => {
    const { listener, data, msg, junk } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const dataStr = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
    const junkUpdatedData = JSON.parse(dataStr);

    expect(junkUpdatedData.id).toEqual(junk.id);
    expect(junkUpdatedData.orderId).not.toBeDefined();
  });
});
