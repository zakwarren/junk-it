import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "common";

import { Order } from "../models";
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

    await stripe.charges.create({
      currency: "gbp",
      amount: order.price * 100,
      source: token,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
