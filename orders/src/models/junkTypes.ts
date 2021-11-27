import mongoose from "mongoose";

export interface JunkAttrs {
  _id?: string;
  title: string;
  price: number;
}

export interface JunkDoc extends mongoose.Document, JunkAttrs {
  _id: string;
  version: number;
  isReserved: () => Promise<Boolean>;
  findByEvent(event: { id: string; version: number }): Promise<JunkDoc | null>;
}
