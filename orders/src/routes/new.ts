import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  DatabaseConnectionError,
} from "common";

import { Junk, Order, OrderStatus } from "../models";

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
