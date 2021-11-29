import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, OrderCreatedEvent, OrderStatus } from "common";

import { OrderCreatedListener } from "../listeners";
import { Junk } from "../../models";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const junk = new Junk({ title: "Hello there", price: 20, userId: "123" });
  await junk.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: "1",
    junk: { id: junk.id, price: junk.price },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, junk };
};

describe("order created listener", () => {
  it("sets the orderId of the junk", async () => {
    const { listener, data, msg, junk } = await setup();
    await listener.onMessage(data, msg);

    const updatedJunk = await Junk.findById(junk.id);

    expect(updatedJunk!.orderId).toEqual(data.id);
  });

  it("acks the message", async () => {
    const { listener, data, msg, junk } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("publishes a junk updated event", async () => {
    const { listener, data, msg, junk } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const dataStr = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
    const junkUpdatedData = JSON.parse(dataStr);

    expect(junkUpdatedData.id).toEqual(junk.id);
    expect(junkUpdatedData.orderId).toEqual(data.id);
  });
});
