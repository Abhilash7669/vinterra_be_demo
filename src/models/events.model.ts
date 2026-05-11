import {
  EventPriority,
  EventType,
  type IEventsModel,
} from "@/interfaces/event.interface.js";
import { model, Schema } from "mongoose";

export const eventSchema = new Schema<IEventsModel>(
  {
    // cameraId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Camera",
    //   required: true,
    // },
    cameraName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
    },
    startTimestamp: {
      type: Date,
      required: true,
    },
    endTimestamp: {
      type: Date,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    thumbnailSize: {
      type: Number,
      default: 0,
    },
    isResolved: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Event = model<IEventsModel>("Event", eventSchema, "events");
export default Event;
