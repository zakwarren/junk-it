import { Router } from "express";

const router = Router();

router.post("/signout", (req, res) => {
  res.send("Hello world!");
});

export { router as singoutRouter };
