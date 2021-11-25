import { Publisher, Subjects, JunkUpdatedEvent } from "common";

export class JunkUpdatedPublisher extends Publisher<JunkUpdatedEvent> {
  readonly subject: Subjects.JunkUpdated = Subjects.JunkUpdated;
}
