import express, { Request, Response } from "express";
import { param, body } from "express-validator";
import mongoose from "mongoose";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  DatabaseConnectionError,
} from "common";

import { Junk } from "../models";
import { JunkUpdatedPublisher } from "../events";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/:id",
  requireAuth,
  [
    param("id").isMongoId().withMessage("Please provide a valid junk id"),
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const junk = await Junk.findById(req.params.id);

    if (!junk) {
      throw new NotFoundError();
    }

    if (junk.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      junk.set({ title: req.body.title, price: req.body.price });
      await junk.save();

      await new JunkUpdatedPublisher(natsWrapper.client).publish({
        id: junk.id,
        title: junk.title,
        price: junk.price,
        userId: junk.userId,
      });

      await session.commitTransaction();
      res.send(junk);
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
);

export { router as updateJunkRouter };
