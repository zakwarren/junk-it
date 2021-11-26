import express, { Request, Response } from "express";
import { param } from "express-validator";
import { validateRequest } from "common";

const router = express.Router();

router.get(
  "/:orderId",
  [param("id").isMongoId().withMessage("Please provide a valid order id")],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as showOrderRouter };
