import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  DatabaseConnectionError,
  natsWrapper,
} from "common";

import { Junk } from "../models";
import { JunkCreatedPublisher } from "../events";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const junk = new Junk({ title, price, userId: req.user!.id });
      await junk.save();

      await new JunkCreatedPublisher(natsWrapper.client).publish({
        id: junk.id,
        title: junk.title,
        price: junk.price,
        userId: junk.userId,
        version: junk.version,
      });

      await session.commitTransaction();
      res.status(201).send(junk);
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
);

export { router as createJunkRouter };
