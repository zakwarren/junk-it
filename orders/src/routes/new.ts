import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  DatabaseConnectionError,
  natsWrapper,
  OrderStatus,
} from "common";

import { Junk, Order } from "../models";
import { OrderCreatedPublisher } from "../events";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [body("junkId").not().isEmpty().withMessage("Junk ID must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { junkId } = req.body;

    const junk = await Junk.findById(junkId);
    if (!junk) {
      throw new NotFoundError();
    }

    const isReserved = await junk.isReserved();
    if (isReserved) {
      throw new BadRequestError("Junk is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + +process.env.EXPIRATION_WINDOW_SECONDS!
    );

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const order = new Order({
        userId: req.user!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        junk,
      });
      await order.save();

      new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        junk: { id: junk.id, price: junk.price },
      });

      await session.commitTransaction();
      res.status(201).send(order);
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
);

export { router as newOrderRouter };
