import { Message } from "node-nats-streaming";
import { Listener, Subjects, JunkCreatedEvent } from "common";

import { queueGroupName } from "./queue-group-name";
import { Junk } from "../../models";

export class JunkCreatedListener extends Listener<JunkCreatedEvent> {
  subject: Subjects.JunkCreated = Subjects.JunkCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: JunkCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const junk = new Junk({ _id: id, title, price });
    await junk.save();

    msg.ack();
  }
}
