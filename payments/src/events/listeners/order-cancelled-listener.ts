import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
  DatabaseConnectionError,
} from "common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data);
    if (!order) {
      throw new Error("Order not found");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      order.set({ status: OrderStatus.Cancelled });
      await order.save();

      await session.commitTransaction();
      msg.ack();
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
}
