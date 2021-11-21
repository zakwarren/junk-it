import { Schema, model } from "mongoose";

interface JunkAttrs {
  title: string;
  price: number;
  userId: string;
}

type JunkDoc = Document & JunkAttrs;

const junkSchema = new Schema<JunkDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
});

junkSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
  versionKey: false,
});

const JunkModel = model<JunkDoc>("Junk", junkSchema);

class Junk extends JunkModel {
  constructor(attrs: JunkAttrs) {
    super(attrs);
  }
}

export { Junk };
