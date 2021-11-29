import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  DatabaseConnectionError,
} from "common";

import { queueGroupName } from "./queue-group-name";
import { JunkUpdatedPublisher } from "../publishers";
import { Junk } from "../../models";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const junk = await Junk.findById(data.junk.id);
    if (!junk) {
      throw new Error("Junk not found");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      junk.set({ orderId: undefined });
      await junk.save();

      await new JunkUpdatedPublisher(this.client).publish({
        id: junk.id,
        version: junk.version,
        title: junk.title,
        price: junk.price,
        userId: junk.userId,
        orderId: junk.orderId,
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
