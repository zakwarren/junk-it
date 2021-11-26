import { Schema, model } from "mongoose";

import { Order, OrderStatus } from "./order";
import { JunkAttrs, JunkDoc } from "./junkTypes";

const junkSchema = new Schema<JunkDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

junkSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
  versionKey: false,
});
junkSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    junk: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const JunkModel = model<JunkDoc>("Junk", junkSchema);

class Junk extends JunkModel {
  constructor(attrs: JunkAttrs) {
    super(attrs);
  }
}

export { Junk };
