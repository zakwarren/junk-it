import { Schema, Document, model } from "mongoose";
import { OrderStatus } from "common";

import { JunkDoc } from "./junk";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  junk: JunkDoc;
}

type OrderDoc = Document & OrderAttrs;

const orderSchema = new Schema<OrderDoc>({
  userId: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: { type: Schema.Types.Date },
  junk: { type: Schema.Types.ObjectId, ref: "Junk" },
});

orderSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
  versionKey: false,
});

const OrderModel = model<OrderDoc>("Order", orderSchema);

class Order extends OrderModel {
  constructor(attrs: OrderAttrs) {
    super(attrs);
  }
}

export { Order };
