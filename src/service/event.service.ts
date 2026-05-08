import {
  EventPriority,
  EventType,
  type AnalyticsMetadata,
  type IEvents,
} from "@/interfaces/event.interface.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import Event from "@/models/events.model.js";

function mapAnalyticsEventType(eventType: AnalyticsMetadata["eventType"]) {
  switch (eventType) {
    case 0x01:
      return EventType.FRISKING;
    case 0x02:
      return EventType.ABANDONMENT;
    case 0x03:
      return EventType.WEAPON;
    default:
      throw new CustomAppError("Invalid analytics event type", 400);
  }
}

function getEventPriority(eventType: EventType) {
  switch (eventType) {
    case EventType.WEAPON:
    case EventType.ABANDONMENT:
      return EventPriority.HIGH;
    case EventType.FRISKING:
      return EventPriority.MEDIUM;
    default:
      return EventPriority.LOW;
  }
}

export function transformAnalyticsMetadataToEvent(
  metadata: AnalyticsMetadata,
): IEvents {
  const eventType = mapAnalyticsEventType(metadata.eventType);

  return {
    cameraId: metadata.cameraId,
    eventType,
    confidence: metadata.confidence,
    startTimestamp: new Date(metadata.startTimestampUs / 1000),
    endTimestamp: new Date(metadata.endTimestampUs / 1000),
    event: JSON.stringify(metadata.event),
    thumbnailSize: metadata.thumbnailSize,
    isResolved: metadata.isResolved === 0 ? false : true,
    priority: getEventPriority(eventType),
  };
}

export const dummyDeviceFriskingMetadata: AnalyticsMetadata = {
  eventType: 0x01,
  cameraId: 1,
  confidence: 0.94,
  startTimestampUs: 1_717_243_200_000_000,
  endTimestampUs: 1_717_243_205_000_000,
  thumbnailSize: 4096,
  event: {
    subjectBbox: {
      x1: 120,
      x2: 360,
      y1: 80,
      y2: 640,
    },
    guardBbox: {
      x1: 420,
      x2: 650,
      y1: 90,
      y2: 650,
    },
    keypoints: [],
  },
  isResolved: 0,
};

export const dummyDeviceWeaponMetadata: AnalyticsMetadata = {
  eventType: 0x03,
  cameraId: 2,
  confidence: 0.88,
  startTimestampUs: 1_717_243_210_000_000,
  endTimestampUs: 1_717_243_212_000_000,
  thumbnailSize: 2048,
  event: {
    weaponBbox: {
      x1: 220,
      x2: 310,
      y1: 180,
      y2: 260,
    },
  },
  isResolved: 1,
};

export const dummyBackendFriskingEvent: IEvents =
  transformAnalyticsMetadataToEvent(dummyDeviceFriskingMetadata);

export const dummyBackendWeaponEvent: IEvents =
  transformAnalyticsMetadataToEvent(dummyDeviceWeaponMetadata);

export async function saveEvent(data: IEvents) {
  const {
    cameraId,
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
      cameraId,
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
