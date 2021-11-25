export enum OrderStatus {
  // when the order has been created, but the
  // junk it is trying to order has not been reserved
  Created = "created",

  // The junk the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order
  // or the order expires before payment
  Cancelled = "cancelled",

  // The order has successfully reserved the junk
  AwaitingPayment = "awaiting:payment",

  // The order has reserved the junk and the user has
  // provided payment successfully
  Complete = "complete",
}
