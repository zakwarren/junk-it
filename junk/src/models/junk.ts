import { Schema, Document, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface JunkAttrs {
  title: string;
  price: number;
  userId: string;
}

interface JunkDoc extends Document, JunkAttrs {
  version: number;
  orderId?: string;
}

const junkSchema = new Schema<JunkDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
  orderId: { type: String },
});

junkSchema.set("versionKey", "version");
junkSchema.plugin(updateIfCurrentPlugin);

junkSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const JunkModel = model<JunkDoc>("Junk", junkSchema);

class Junk extends JunkModel {
  constructor(attrs: JunkAttrs) {
    super(attrs);
  }
}

export { Junk };
