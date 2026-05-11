import { Document } from "mongoose";

export type EventType = "frisking" | "abandonment" | "weapon";

export type EventPriority = "high" | "medium" | "low";

interface AnalyticsBbox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface AnalyticsKeypoint {
  x: number;
  y: number;
  confidence: number;
  activated_at_us: number;
}

interface FriskingMeta {
  subject_bbox: AnalyticsBbox;
  guard_bbox: AnalyticsBbox;
  keypoints: AnalyticsKeypoint[];
}

interface AbandonmentMeta {
  object_bbox: AnalyticsBbox;
}

interface WeaponMeta {
  weapon_bbox: AnalyticsBbox;
}

type AnalyticsEvent =
  | { event_type: "frisking"; event: FriskingMeta; frisking_complete: 0 | 1 }
  | { event_type: "abandonment"; event: AbandonmentMeta }
  | { event_type: "weapon"; event: WeaponMeta };

export type AnalyticsMetadata = AnalyticsEvent & {
  camera_name: string;
  confidence: number;
  start_timestamp_us: number;
  end_timestamp_us: number;
  thumbnail_size: number;
};

export interface IEvents {
  cameraName: string;
  eventType: EventType;
  confidence: number;
  startTimestamp: Date;
  endTimestamp: Date;
  event: string;
  thumbnailSize: number;
  isResolved: boolean;
  priority: EventPriority;
}

export interface IEventsModel extends IEvents, Document {}

export type EventsParamsDTO = {
  isResolved?: "false" | "true";
  priority?: EventPriority;
  startTimestamp?: string;
  endTimestamp?: string;
  confidence?: number;
  eventType?: EventType;
};
