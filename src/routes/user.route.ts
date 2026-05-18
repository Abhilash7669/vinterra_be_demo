import { createUserController } from "@/controller/user.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/create", createUserController);

export default userRouter;
