import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, OrderCreatedEvent, OrderStatus } from "common";

import { OrderCreatedListener } from "../listeners";
import { Order } from "../../models";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "test date",
    userId: "1234",
    status: OrderStatus.Created,
    junk: { id: "abc", price: 10 },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

describe("order created listener", () => {
  it("replicates the order data", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order?.price).toEqual(data.junk.price);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
