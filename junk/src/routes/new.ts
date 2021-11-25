import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "common";

import { Junk } from "../models";
import { JunkCreatedPublisher } from "../events";
import { natsWrapper } from "../nats-wrapper";

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

    const junk = new Junk({ title, price, userId: req.user!.id });
    await junk.save();
    new JunkCreatedPublisher(natsWrapper.client).publish({
      id: junk.id,
      title: junk.title,
      price: junk.price,
      userId: junk.userId,
    });

    res.status(201).send(junk);
  }
);

export { router as createJunkRouter };
