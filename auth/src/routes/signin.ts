import { Router } from "express";

const router = Router();

router.post("/signin", (req, res) => {
  res.send("Hello world!");
});

export { router as signinRouter };
