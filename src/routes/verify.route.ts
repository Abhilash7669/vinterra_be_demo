import { authCookieMiddleware } from "@/middleware/auth.middleware.js";
import { Router } from "express";

const verifyRouter = Router();

verifyRouter.get("/", authCookieMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Verified",
    data: null,
  });
});

export default verifyRouter;
