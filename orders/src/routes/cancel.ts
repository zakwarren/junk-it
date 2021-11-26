import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { param } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  DatabaseConnectionError,
} from "common";

import { Order, OrderStatus } from "../models";

const router = express.Router();

router.patch(
  "/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Please provide a valid order id")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const order = await Order.findOne({ id: orderId, userId: req.user!.id });
    if (!order) {
      throw new NotFoundError();
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      order.status = OrderStatus.Cancelled;
      await order.save();

      await session.commitTransaction();
      res.send(order);
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
);

export { router as cancelOrderRouter };
