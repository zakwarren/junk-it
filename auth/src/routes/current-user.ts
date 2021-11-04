import { Router } from "express";
import { currentUser } from "common";

const router = Router();

router.get("/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.user || null });
});

export { router as currentUserRouter };
