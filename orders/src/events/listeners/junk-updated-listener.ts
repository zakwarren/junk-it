import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Listener,
  Subjects,
  JunkUpdatedEvent,
  DatabaseConnectionError,
} from "common";

import { Junk } from "../../models";
import { queueGroupName } from "./queue-group-name";

export class JunkUpdatedListener extends Listener<JunkUpdatedEvent> {
  subject: Subjects.JunkUpdated = Subjects.JunkUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: JunkUpdatedEvent["data"], msg: Message) {
    const junk = await Junk.findByEvent(data);
    if (!junk) {
      throw new Error("Junk not found");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const { title, price } = data;
      junk.set({ title, price });
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
