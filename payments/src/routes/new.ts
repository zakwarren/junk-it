import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  OrderStatus,
  NotFoundError,
  BadRequestError,
  DatabaseConnectionError,
  natsWrapper,
} from "common";

import { Order, Payment } from "../models";
import { PaymentCreatedPublisher } from "../events";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token is required"),
    body("orderId")
      .not()
      .isEmpty()
      .withMessage("Order ID is required")
      .isMongoId()
      .withMessage("Please provide a valid order ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, userId: req.user?.id });
    if (!order) {
      throw new NotFoundError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "gbp",
      amount: order.price * 100,
      source: token,
    });

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const payment = new Payment({ orderId, stripeId: charge.id });
      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      await session.commitTransaction();
      res.status(201).send({ id: payment.id });
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
);

export { router as createChargeRouter };
