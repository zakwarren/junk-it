import { Message } from "node-nats-streaming";
import { natsWrapper, ExpirationCompleteEvent, OrderStatus } from "common";

import { ExpirationCompleteListener } from "../listeners";
import { Junk, Order } from "../../models";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const junk = new Junk({ title: "Hello there", price: 20 });
  await junk.save();

  const order = new Order({
    status: OrderStatus.Created,
    userId: "test",
    expiresAt: new Date(),
    junk,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = { orderId: order.id };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, junk, order };
};

describe("expiration complete listener", () => {
  it("updates the order status to cancelled", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  });

  it("emits an OrderCancelled event", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const rawEventData = (natsWrapper.client.publish as jest.Mock).mock
      .calls[0][1];
    const eventData = JSON.parse(rawEventData);
    expect(eventData.id).toEqual(order.id);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
