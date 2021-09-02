import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidationError } from "../errors";
import { User } from "../models";

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid")
      .bail()
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("Email in use");
        }
        return true;
      }),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
