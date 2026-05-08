import type { ICamera } from "@/interfaces/camera.interface.js";
import { model, Schema } from "mongoose";

export const cameraSchema = new Schema<ICamera>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
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

const Camera = model<ICamera>("Camera", cameraSchema, "cameras");
export default Camera;
