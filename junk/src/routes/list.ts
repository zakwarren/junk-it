import express, { Request, Response } from "express";

import { Junk } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const junk = await Junk.find({ orderId: undefined });

  res.send(junk);
});

export { router as listJunkRouter };
