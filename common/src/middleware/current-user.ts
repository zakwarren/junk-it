import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const { id, email } = jwt.verify(
      req.session.jwt,
      process.env.JWT_PUBLIC_KEY!,
      { algorithms: ["RS256"] }
    ) as UserPayload;
    req.user = { id, email };
  } catch (err) {
    console.log(err);
  } finally {
    next();
  }
};
