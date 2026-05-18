import { Document } from "mongoose";

export interface ICamera {
  cameraName: string;
  location?: string;
  siteId?: string;
  floorId?: string;
  status: boolean;
  //   coordinates: {
  //     x: number;
  //     y: number;
  //   };
}

export interface ICameraModel extends ICamera, Document {}
