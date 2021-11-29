import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  DatabaseConnectionError,
} from "common";

import { queueGroupName } from "./queue-group-name";
import { JunkUpdatedPublisher } from "../publishers";
import { Junk } from "../../models";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const {
      id: orderId,
      junk: { id: junkId },
    } = data;

    const junk = await Junk.findById(junkId);
    if (!junk) {
      throw new Error("Junk not found");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      junk.set({ orderId });
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
