import { Message } from "node-nats-streaming";
import { Listener, Subjects, JunkUpdatedEvent } from "common";

import { Junk } from "../../models";
import { queueGroupName } from "./queue-group-name";

export class JunkUpdatedListener extends Listener<JunkUpdatedEvent> {
  subject: Subjects.JunkUpdated = Subjects.JunkUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: JunkUpdatedEvent["data"], msg: Message) {
    const junk = await Junk.findById(data.id);
    if (!junk) {
      throw new Error("Junk not found");
    }

    const { title, price } = data;
    junk.set({ title, price });
    await junk.save();

    msg.ack();
  }
}
