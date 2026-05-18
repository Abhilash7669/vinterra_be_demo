import { ICamera } from "@/interfaces/camera.interface.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import Camera from "@/models/camera.model.js";
import { QueryFilter } from "mongoose";

export async function saveCameras(_cameras: ICamera[]) {
  myLogger.log("Saving Events");
  try {
    const createdCameras = await Camera.insertMany(_cameras);
    myLogger.log(`===== SAVED CAMERAS ===== ${createdCameras}`);
    return createdCameras;
  } catch (error) {
    myLogger.log(`ERROR SAVING CAMERAS: ${error}`);
    throw new CustomAppError(
      error instanceof Error ? error.message : "Something went wrong",
      500,
    );
  }
}

export async function getCameras(options?: {
  skip: number;
  limit: number;
  filter?: QueryFilter<ICamera>;
}) {
  try {
    const cameras = await Camera.find(options?.filter || {})
      .skip(options?.skip || 0)
      .limit(options?.limit || 500);
    return cameras;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomAppError(
        error.message || "Something went wrong, no message found",
        500,
      );
    } else {
      throw new CustomAppError("Something went wrong", 500);
    }
  }
}
