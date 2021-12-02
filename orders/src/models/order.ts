import { Schema, Document, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "common";

import { JunkDoc } from "./junkTypes";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  junk: JunkDoc;
}

interface OrderDoc extends Document, OrderAttrs {
  version: number;
}

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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const OrderModel = model<OrderDoc>("Order", orderSchema);

class Order extends OrderModel {
  constructor(attrs: OrderAttrs) {
    super(attrs);
  }
}

export { Order };
