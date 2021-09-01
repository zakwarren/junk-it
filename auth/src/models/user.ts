import { Schema, model } from "mongoose";

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

const UserModel = model<UserDoc>("User", userSchema);

class User extends UserModel {
  constructor(attrs: UserAttrs) {
    super(attrs);
  }
}

export { User };
