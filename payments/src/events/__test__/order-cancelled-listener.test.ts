import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, OrderCancelledEvent, OrderStatus } from "common";

import { OrderCancelledListener } from "../listeners";
import { Order } from "../../models";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = new Order({
    _id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
    userId: "123",
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    junk: { id: "abc" },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, order };
};

describe("order cancelled listener", () => {
  it("updates the status of the order", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  });

  it("acks the message", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
