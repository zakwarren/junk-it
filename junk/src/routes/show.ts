import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotFoundError, validateRequest } from "common";

import { Junk } from "../models";

const router = express.Router();

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Please provide a valid junk id")],
  validateRequest,
  async (req: Request, res: Response) => {
    const junk = await Junk.findById(req.params.id);

    if (!junk) {
      throw new NotFoundError();
    }

    res.send(junk);
  }
);

export { router as showJunkRouter };
