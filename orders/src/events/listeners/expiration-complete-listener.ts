import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  DatabaseConnectionError,
  OrderStatus,
} from "common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models";
import { OrderCancelledPublisher } from "../publishers";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("junk");
    if (!order) {
      throw new Error("Order not found");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      order.set({ status: OrderStatus.Cancelled });
      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        junk: { id: order.junk.id },
      });

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
