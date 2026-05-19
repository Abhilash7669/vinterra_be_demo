import {
  EventPriority,
  EventType,
  type EventComplianceStatus,
  type AnalyticsMetadata,
  type IEvents,
} from "@/interfaces/event.interface.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import Camera from "@/models/camera.model.js";
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
  console.log(`==== TRANSFORMING EVENT =====`);
  console.log(`=== EVENT TYPE: ${metadata.event_type}`);

  if (metadata.event_type === "frisking") {
    console.log(
      `===== FRISKING STATUS: ${metadata.frisking_complete} && value: ${metadata.frisking_complete === 1} && type of value: ${typeof metadata.frisking_complete}`,
    );
  }

  const eventType = metadata.event_type;
  const friskingComplete =
    eventType === "frisking"
      ? (metadata.event.frisking_complete ?? metadata.frisking_complete ?? 0)
      : 0;
  const isFriskingComplete =
    eventType === "frisking" && friskingComplete === 1;
  const isResolved = eventType === "frisking" ? isFriskingComplete : false;
  const complianceStatus: EventComplianceStatus = isFriskingComplete
    ? "compliant"
    : "non_compliant";

  const _event = {
    cameraName: metadata.camera_name,
    eventType,
    confidence: metadata.confidence,
    startTimestampUs: metadata.start_timestamp_us,
    endTimestampUs: metadata.end_timestamp_us,
    startTimestamp: new Date(metadata.start_timestamp_us / 1000),
    endTimestamp: new Date(metadata.end_timestamp_us / 1000),
    event: metadata.event,
    thumbnailSize: metadata.thumbnail_size,
    complianceStatus,
    isResolved,
    priority: getEventPriority(eventType),
  } satisfies IEvents;

  console.log(`====== FINAL SAVED EVENT =====`);
  console.log(_event);

  return _event;
}

// Dummy datas for testing
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
    zones: [
      {
        zone_name: "L_Shoulder_F",
        activated_at_us: 0,
      },
      {
        zone_name: "Chest_F",
        activated_at_us: 1_717_243_201_000_000,
      },
    ],
    frisking_complete: 0,
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
    complianceStatus,
    endTimestamp,
    endTimestampUs,
    event,
    eventType,
    isResolved,
    startTimestamp,
    startTimestampUs,
    thumbnailSize,
    priority,
  } = data;
  try {
    const camera = await Camera.findOne({ cameraName }).select("_id").lean();
    const eventCreated = await Event.create({
      confidence,
      cameraName,
      ...(camera ? { cameraId: camera._id } : {}),
      complianceStatus,
      endTimestamp,
      endTimestampUs,
      startTimestamp,
      startTimestampUs,
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
