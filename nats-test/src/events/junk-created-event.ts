import { Subjects } from "./subjects";

export interface JunkCreatedEvent {
  subject: Subjects.JunkCreated;
  data: { id: string; title: string; price: number };
}
