import type { ICameraModel } from "@/interfaces/camera.interface.js";
import { model, Schema } from "mongoose";

export const cameraSchema = new Schema<ICameraModel>(
  {
    cameraName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    siteId: {
      type: String,
      trim: true,
    },
    floorId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Camera = model<ICameraModel>("Camera", cameraSchema, "cameras");
export default Camera;
