import { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Order, OrderStatus } from "./order";
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
}

export { Junk };
