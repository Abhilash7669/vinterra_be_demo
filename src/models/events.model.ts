import {
  EventPriority,
  EventType,
  type IEventsModel,
} from "@/interfaces/event.interface.js";
import { model, Schema } from "mongoose";

export const eventSchema = new Schema<IEventsModel>(
  {
    cameraId: {
      type: Schema.Types.ObjectId,
      ref: "Camera",
      index: true,
    },
    cameraName: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
    },
    startTimestampUs: {
      type: Number,
      required: true,
      index: true,
    },
    endTimestampUs: {
      type: Number,
      required: true,
      index: true,
    },
    startTimestamp: {
      type: Date,
      required: true,
      index: true,
    },
    endTimestamp: {
      type: Date,
      required: true,
      index: true,
    },
    event: {
      type: Schema.Types.Mixed,
      required: true,
    },
    thumbnailSize: {
      type: Number,
      default: 0,
    },
    complianceStatus: {
      type: String,
      required: true,
      enum: ["compliant", "non_compliant"],
      index: true,
    },
    isResolved: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Event = model<IEventsModel>("Event", eventSchema, "events");
export default Event;
