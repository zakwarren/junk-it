import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper, PaymentCreatedEvent, OrderStatus } from "common";

import { PaymentCreatedListener } from "../listeners";
import { Junk, Order } from "../../models";

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  const junk = new Junk({ title: "Hello there", price: 20 });
  await junk.save();
  const order = new Order({
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: new Date(),
    junk: junk.id,
  });
  await order.save();

  const data: PaymentCreatedEvent["data"] = {
    id: "1",
    stripeId: "abc",
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, junk, order };
};

describe("payment created listener", () => {
  it("sets the order status to complete", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Complete);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
