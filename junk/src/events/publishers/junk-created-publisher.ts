import { Publisher, Subjects, JunkCreatedEvent } from "common";

export class JunkCreatedPublisher extends Publisher<JunkCreatedEvent> {
  readonly subject: Subjects.JunkCreated = Subjects.JunkCreated;
}
