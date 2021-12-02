import { Schema, Document, model } from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends Document, PaymentAttrs {
  version: number;
}

const paymentSchema = new Schema<PaymentDoc>({
  orderId: { required: true, type: String },
  stripeId: { required: true, type: String },
});

paymentSchema.set("versionKey", "version");

paymentSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const PaymentModel = model<PaymentDoc>("Payment", paymentSchema);

class Payment extends PaymentModel {
  constructor(attrs: PaymentAttrs) {
    super(attrs);
  }
}

export { Payment };
