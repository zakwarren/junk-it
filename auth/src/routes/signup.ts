import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidationError, DatabaseConnectionError } from "../errors";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    console.log("Creating a user...");
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
