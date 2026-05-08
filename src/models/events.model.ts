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
    cameraId: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      enum: Object.values(EventType),
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
      enum: Object.values(EventPriority),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Event = model<IEventsModel>("Event", eventSchema, "events");
export default Event;
