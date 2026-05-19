import { Document, Types } from "mongoose";

export type EventType = "frisking" | "abandonment" | "weapon";

export type EventPriority = "high" | "medium" | "low";

export type EventComplianceStatus = "compliant" | "non_compliant";

export interface AnalyticsBbox {
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

export interface FriskingZone {
  zone_name: string;
  activated_at_us: number;
}

export interface FriskingMeta {
  subject_bbox: AnalyticsBbox;
  guard_bbox: AnalyticsBbox;
  zones: FriskingZone[];
  frisking_complete: 0 | 1;
  keypoints?: AnalyticsKeypoint[];
}

export interface AbandonmentMeta {
  object_bbox: AnalyticsBbox;
}

export interface WeaponMeta {
  weapon_bbox: AnalyticsBbox;
}

export type EventMetadata = FriskingMeta | AbandonmentMeta | WeaponMeta;

type AnalyticsEvent =
  | { event_type: "frisking"; event: FriskingMeta; frisking_complete?: 0 | 1 }
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
  cameraId?: Types.ObjectId;
  cameraName: string;
  eventType: EventType;
  confidence: number;
  startTimestampUs: number;
  endTimestampUs: number;
  startTimestamp: Date;
  endTimestamp: Date;
  event: EventMetadata;
  thumbnailSize: number;
  complianceStatus: EventComplianceStatus;
  isResolved: boolean;
  priority: EventPriority;
}

export interface IEventsModel extends IEvents, Document {}

export type EventsPaginationDTO = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  lastPage: number;
  currentPageItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type EventsListDataDTO<TEvent> = {
  events: TEvent[];
  pagination: EventsPaginationDTO;
};

export type EventsParamsDTO = {
  isResolved?: "false" | "true";
  complianceStatus?: EventComplianceStatus;
  priority?: EventPriority;
  startDate?: string;
  endDate?: string;
  startTimestamp?: string;
  endTimestamp?: string;
  confidence?: number;
  eventType?: EventType;
};
