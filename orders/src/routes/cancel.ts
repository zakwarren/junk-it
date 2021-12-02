import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { param } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  DatabaseConnectionError,
  natsWrapper,
  OrderStatus,
} from "common";

import { Order } from "../models";
import { OrderCancelledPublisher } from "../events";

const router = express.Router();

router.patch(
  "/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Please provide a valid order id")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const order = await Order.findOne({
      id: orderId,
      userId: req.user!.id,
    }).populate("junk");
    if (!order) {
      throw new NotFoundError();
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      order.status = OrderStatus.Cancelled;
      await order.save();

      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        junk: { id: order.junk.id },
      });

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
