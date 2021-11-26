import mongoose from "mongoose";

export interface JunkAttrs {
  title: string;
  price: number;
}

export interface JunkDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved: () => Promise<Boolean>;
}
