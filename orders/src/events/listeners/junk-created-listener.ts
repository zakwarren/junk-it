import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Listener,
  Subjects,
  JunkCreatedEvent,
  DatabaseConnectionError,
} from "common";

import { queueGroupName } from "./queue-group-name";
import { Junk } from "../../models";

export class JunkCreatedListener extends Listener<JunkCreatedEvent> {
  subject: Subjects.JunkCreated = Subjects.JunkCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: JunkCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const junk = new Junk({ _id: id, title, price });
      await junk.save();

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
