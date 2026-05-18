import { authCookieMiddleware } from "@/middleware/auth.middleware.js";
import authRouter from "@/routes/auth.route.js";
import cameraRouter from "@/routes/camera.route.js";
import eventsRouter from "@/routes/events.route.js";
import userRouter from "@/routes/user.route.js";
import verifyRouter from "@/routes/verify.route.js";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/cameras", cameraRouter);
router.use("/users", userRouter);
router.use("/verify", verifyRouter);
router.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

export default router;
