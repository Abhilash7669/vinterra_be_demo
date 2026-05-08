import { postLoginAuthController } from "@/controller/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", postLoginAuthController);

export default authRouter;
