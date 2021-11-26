import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "common";

import { Junk } from "../models";

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

    res.send({});
  }
);

export { router as newOrderRouter };
