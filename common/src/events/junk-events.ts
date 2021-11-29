import { Subjects } from "./subjects";

export interface JunkCreatedEvent {
  subject: Subjects.JunkCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}

export interface JunkUpdatedEvent {
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
