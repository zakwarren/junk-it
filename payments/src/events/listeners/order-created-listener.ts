import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  DatabaseConnectionError,
} from "common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const order = new Order({
        _id: data.id,
        price: data.junk.price,
        status: data.status,
        userId: data.userId,
        version: data.version,
      });
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
