import { Schema, Document, model } from "mongoose";
import { PasswordManager } from "../services";

interface UserAttrs {
  email: string;
  password: string;
}

type UserDoc = Document & UserAttrs;

const userSchema = new Schema<UserDoc>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
  },
  versionKey: false,
});

const UserModel = model<UserDoc>("User", userSchema);

class User extends UserModel {
  constructor(attrs: UserAttrs) {
    super(attrs);
  }
}

export { User };
