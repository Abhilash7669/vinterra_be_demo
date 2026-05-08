import { Document } from "mongoose";

export interface ICamera extends Document {
  name: string;
  location: string;
  siteId?: string;
  floorId?: string;
  //   coordinates: {
  //     x: number;
  //     y: number;
  //   };
}
