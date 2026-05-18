import { CustomAppError } from "@/lib/utils/error.utils.js";
import { loginAuthService } from "@/service/auth.service.js";
import { Request, Response } from "express";

export async function loginAuthController(req: Request, res: Response) {
  const { password, email } = req.body;

  if (!password || !email) throw new CustomAppError("Bad request", 400);

  const user = await loginAuthService(email, password);

  if (user) {
    res.cookie("vinterra-token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      path: "/",
    });
    return res.json({
      success: true,
      message: `Successfully logged in`,
      data: { email: user.email },
    });
  }
}
