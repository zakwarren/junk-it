import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";

export class JunkCreatedListener extends Listener {
  subject = "junk:created";
  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message) {
    console.log("Event data", data);

    msg.ack();
  }
}
