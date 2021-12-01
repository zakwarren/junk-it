import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from "common";

import { Order } from "../models";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token is required"),
    body("orderId").not().isEmpty().withMessage("Order ID is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
