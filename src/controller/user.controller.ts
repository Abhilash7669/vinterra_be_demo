import { CustomAppError } from "@/lib/utils/error.utils.js";
import { createUserService } from "@/service/user.service.js";
import { Request, Response } from "express";

export async function createUserController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomAppError("Bad Format", 400);
  }

  const createdUser = await createUserService({ email, password });

  if (createdUser) {
    res.json({
      success: true,
      data: createdUser,
      message: "Created user successfully",
    });
    return;
  }
}
