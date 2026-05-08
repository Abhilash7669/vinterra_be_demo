import { Document } from "mongoose";

enum AnalyticsEventType {
  FRISKING = 0x01,
  ABANDONMENT = 0x02,
  WEAPON = 0x03,
}

interface AnalyticsBbox {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface AnalyticsKeypoint {
  x: number;
  y: number;
  confidence: number;
  activatedAtUs: bigint;
}

interface FriskingMeta {
  subjectBbox: AnalyticsBbox;
  guardBbox: AnalyticsBbox;
  keypoints: AnalyticsKeypoint[];
}

interface AbandonmentMeta {
  objectBbox: AnalyticsBbox;
}

interface WeaponMeta {
  weaponBbox: AnalyticsBbox;
}

type AnalyticsEvent =
  | { eventType: AnalyticsEventType.FRISKING; event: FriskingMeta }
  | { eventType: AnalyticsEventType.ABANDONMENT; event: AbandonmentMeta }
  | { eventType: AnalyticsEventType.WEAPON; event: WeaponMeta };

export type AnalyticsMetadata = AnalyticsEvent & {
  cameraId: number;
  confidence: number;
  startTimestampUs: number;
  endTimestampUs: number;
  thumbnailSize: number;
  isResolved: number;
};

export enum EventType {
  FRISKING = "frisking",
  ABANDONMENT = "abandonment",
  WEAPON = "weapon",
}

export enum EventPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export interface IEvents {
  cameraId: number;
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
