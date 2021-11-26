import express, { Request, Response } from "express";
import { param } from "express-validator";
import { requireAuth, validateRequest, NotFoundError } from "common";

import { Order } from "../models";

const router = express.Router();

router.get(
  "/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Please provide a valid order id")],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user!.id,
    }).populate("junk");
    if (!order) {
      throw new NotFoundError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
