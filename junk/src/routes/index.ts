import express, { Request, Response } from "express";

import { Junk } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const junk = await Junk.find({});

  res.send(junk);
});

export { router as indexJunkRouter };
export { createJunkRouter } from "./new";
export { showJunkRouter } from "./show";
