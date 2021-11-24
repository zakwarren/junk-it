import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { JunkCreatedEvent } from "./junk-created-event";

export class JunkCreatedListener extends Listener<JunkCreatedEvent> {
  readonly subject: Subjects.JunkCreated = Subjects.JunkCreated;
  queueGroupName = "payments-service";

  onMessage(data: JunkCreatedEvent["data"], msg: Message) {
    console.log("Event data", data);

    msg.ack();
  }
}
