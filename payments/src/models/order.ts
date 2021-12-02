import { Schema, Document, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "common";

interface OrderAttrs {
  _id?: string;
  version?: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends Document, OrderAttrs {
  _id: string;
  version: number;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

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

  static findByEvent(event: { id: string; version: number }) {
    return Order.findOne({ _id: event.id, version: event.version - 1 });
  }
}

export { Order };
