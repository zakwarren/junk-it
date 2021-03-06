import { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "common";

import { Order } from "./order";
import { JunkAttrs, JunkDoc } from "./junkTypes";

const junkSchema = new Schema<JunkDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

junkSchema.set("versionKey", "version");
junkSchema.plugin(updateIfCurrentPlugin);

junkSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
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

  static findByEvent(event: { id: string; version: number }) {
    return Junk.findOne({ _id: event.id, version: event.version - 1 });
  }
}

export { Junk };
