import { Router } from "express";

const router = Router();

router.get("/currentuser", (req, res) => {
  res.send("Hello world!");
});

export { router as currentUserRouter };
