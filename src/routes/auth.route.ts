import { loginAuthController } from "@/controller/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", loginAuthController);

export default authRouter;
