import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface PaymentCreatedEvent extends Event {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
