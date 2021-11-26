import express, { Request, Response } from "express";
import { requireAuth } from "common";

import { Order } from "../models";

const router = express.Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.user!.id }).populate("junk");

  res.send(orders);
});

export { router as listOrderRouter };
