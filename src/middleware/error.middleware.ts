import { CustomAppError } from "@/lib/utils/error.utils.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import { TResponseDTO } from "@/types/response.types.js";
import { NextFunction, Request, Response } from "express";

export async function errorMiddleware(
  err: CustomAppError,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { message, status } = err;
  myLogger.log(`Message: ${message}\n Status Code: ${status}`);
  const response: TResponseDTO<null> = {
    success: false,
    data: null,
    message,
  };
  res.status(status || 500).json(response);
}
