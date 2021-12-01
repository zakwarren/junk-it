import { Schema, Document, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "common";

interface OrderAttrs {
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends Document, OrderAttrs {}

const orderSchema = new Schema<OrderDoc>({
  userId: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
  },
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

export { Order, OrderStatus };
