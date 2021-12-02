import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface JunkCreatedEvent extends Event {
  subject: Subjects.JunkCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}

export interface JunkUpdatedEvent extends Event {
  subject: Subjects.JunkUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
