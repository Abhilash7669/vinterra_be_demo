import authRouter from "@/routes/auth.route.js";
import eventsRouter from "@/routes/events.route.js";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

export default router;
