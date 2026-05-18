import { IAuthRequest } from "@/interfaces/request.interface.js";
import { verifyJWT } from "@/lib/utils/auth.utils.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import { getUserByIdService } from "@/service/user.service.js";
import { NextFunction, Response } from "express";

export async function authCookieMiddleware(
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const cookie = req.cookies;
  const vinterraToken = req.cookies["vinterra-token"];
  if (cookie && vinterraToken) {
    const decoded = await verifyJWT<{ userId: string }>(vinterraToken);
    const userId = decoded.userId;
    const userExists = await getUserByIdService(userId);

    req.userId = userExists._id.toString();
    next();
  } else {
    throw new CustomAppError("Unauthorized", 401);
  }
}
