import { Subjects } from "./subjects";

export interface JunkUpdatedEvent {
  subject: Subjects.JunkUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
