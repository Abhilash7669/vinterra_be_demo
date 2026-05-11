import {
  EventPriority,
  EventType,
  type AnalyticsMetadata,
  type IEvents,
} from "@/interfaces/event.interface.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import Event from "@/models/events.model.js";

function getEventPriority(eventType: EventType): EventPriority {
  switch (eventType) {
    case "abandonment":
    case "weapon":
      return "high";
    case "frisking":
      return "medium";
    default:
      return "low";
  }
}

export function transformAnalyticsMetadataToEvent(
  metadata: AnalyticsMetadata,
): IEvents {
  const eventType = metadata.event_type;
  const isResolved =
    eventType === "frisking" ? metadata.frisking_complete === 1 : false;

  return {
    cameraName: metadata.camera_name,
    eventType,
    confidence: metadata.confidence,
    startTimestamp: new Date(metadata.start_timestamp_us / 1000),
    endTimestamp: new Date(metadata.end_timestamp_us / 1000),
    event: JSON.stringify(metadata.event),
    thumbnailSize: metadata.thumbnail_size,
    isResolved,
    priority: getEventPriority(eventType),
  };
}

export const dummyDeviceFriskingMetadata: AnalyticsMetadata = {
  event_type: "frisking",
  camera_name: "file_1",
  confidence: 0.94,
  start_timestamp_us: 1_717_243_200_000_000,
  end_timestamp_us: 1_717_243_205_000_000,
  thumbnail_size: 4096,
  frisking_complete: 0,
  event: {
    subject_bbox: {
      x1: 120,
      y1: 80,
      x2: 360,
      y2: 640,
    },
    guard_bbox: {
      x1: 420,
      y1: 90,
      x2: 650,
      y2: 650,
    },
    keypoints: [],
  },
};

export const dummyDeviceWeaponMetadata: AnalyticsMetadata = {
  event_type: "weapon",
  camera_name: "file_2",
  confidence: 0.50976449251174927,
  start_timestamp_us: 3_400_000,
  end_timestamp_us: 3_400_000,
  thumbnail_size: 0,
  event: {
    weapon_bbox: {
      x1: 299.4609375,
      y1: 188.1875,
      x2: 326.4375,
      y2: 216.4140625,
    },
  },
};

export const dummyBackendFriskingEvent: IEvents =
  transformAnalyticsMetadataToEvent(dummyDeviceFriskingMetadata);

export const dummyBackendWeaponEvent: IEvents =
  transformAnalyticsMetadataToEvent(dummyDeviceWeaponMetadata);

export async function saveEvent(data: IEvents) {
  const {
    cameraName,
    confidence,
    endTimestamp,
    event,
    eventType,
    isResolved,
    startTimestamp,
    thumbnailSize,
    priority,
  } = data;
  try {
    const eventCreated = Event.create({
      confidence,
      cameraName,
      endTimestamp,
      startTimestamp,
      event,
      eventType,
      isResolved,
      thumbnailSize,
      priority,
    });
    return eventCreated;
  } catch (error) {
    throw new CustomAppError(
      error instanceof Error ? error.message : "Something went wrong",
      500,
    );
  }
}
