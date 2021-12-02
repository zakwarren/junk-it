import { Event } from "./base-event";
import { OrderStatus } from "./types";
import { Subjects } from "./subjects";

export interface OrderCreatedEvent extends Event {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    junk: {
      id: string;
      price: number;
    };
  };
}

export interface OrderCancelledEvent extends Event {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    junk: {
      id: string;
    };
  };
}
