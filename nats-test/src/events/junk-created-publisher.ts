import { Publisher } from "./base-publisher";
import { JunkCreatedEvent } from "./junk-created-event";
import { Subjects } from "./subjects";

export class JunkCreatedPublisher extends Publisher<JunkCreatedEvent> {
  readonly subject: Subjects.JunkCreated = Subjects.JunkCreated;
}
