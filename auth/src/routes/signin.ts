import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middleware";

const router = Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as signinRouter };
