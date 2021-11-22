import express, { Request, Response } from "express";
import { param, body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "common";

import { Junk } from "../models";

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

    junk.set({ title: req.body.title, price: req.body.price });
    await junk.save();

    res.send(junk);
  }
);

export { router as updateJunkRouter };
