import { myLogger } from "@/lib/logger/my-logger.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import { authCookieMiddleware } from "@/middleware/auth.middleware.js";
import Event from "@/models/events.model.js";
import { Request, Response, Router } from "express";

const eventsRouter = Router();

const DATE_FILTER_KEYS = new Set(["createdAt", "startDate", "endDate"]);

type CreatedAtFilter = {
  $gte?: Date;
  $lt?: Date;
};

type PopulatedCamera = {
  _id?: unknown;
  cameraName?: string;
};

function parsePositiveInteger(value: unknown, fallback: number): number {
  const queryValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(queryValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

function parseUtcDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new CustomAppError("Invalid date filter", 400);
  }

  return date;
}

function parseDateFilter(value: unknown): Date | undefined {
  if (value === undefined) return undefined;

  const queryValue = Array.isArray(value) ? value[0] : value;
  if (typeof queryValue !== "string") {
    throw new CustomAppError("Invalid date filter", 400);
  }

  const dateOnlyValue = parseUtcDateOnly(queryValue);
  if (dateOnlyValue) {
    return dateOnlyValue;
  }

  const date = new Date(queryValue);
  if (Number.isNaN(date.getTime())) {
    throw new CustomAppError("Invalid date filter", 400);
  }

  return date;
}

function getUtcDayStart(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function getNextUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
  );
}

function buildCreatedAtFilter(query: Record<string, unknown>) {
  if (query.createdAt !== undefined) {
    throw new CustomAppError(
      "Use startDate and endDate for date filtering",
      400,
    );
  }

  const startDate = parseDateFilter(query.startDate);
  const endDate = parseDateFilter(query.endDate);
  const createdAtFilter: CreatedAtFilter = {};

  if (startDate && !endDate) {
    return {
      $gte: getUtcDayStart(startDate),
      $lt: getNextUtcDay(startDate),
    };
  }

  if (startDate) {
    createdAtFilter.$gte = startDate;
  }

  if (endDate) {
    createdAtFilter.$lt = endDate;
  }

  if (
    createdAtFilter.$gte &&
    createdAtFilter.$lt &&
    createdAtFilter.$gte.getTime() >= createdAtFilter.$lt.getTime()
  ) {
    throw new CustomAppError("startDate must be before endDate", 400);
  }

  return Object.keys(createdAtFilter).length ? createdAtFilter : undefined;
}

eventsRouter.get("/", async (req: Request, res: Response) => {
  const limit = parsePositiveInteger(req.query.limit, 500);
  const page = parsePositiveInteger(req.query.page, 1);
  const skip = page > 1 ? (page - 1) * limit : 0;

  const filter = Object.entries(req.query).reduce<Record<string, unknown>>(
    (queryFilter, [key, value]) => {
      if (value === undefined) return queryFilter;
      if (key === "limit" || key === "page") return queryFilter;
      if (DATE_FILTER_KEYS.has(key)) return queryFilter;

      if (value === "true") {
        queryFilter[key] = true;
      } else if (value === "false") {
        queryFilter[key] = false;
      } else {
        queryFilter[key] = value;
      }

      return queryFilter;
    },
    {},
  );

  const createdAtFilter = buildCreatedAtFilter(req.query);
  if (createdAtFilter) {
    filter.createdAt = createdAtFilter;
  }

  const [events, totalItems] = await Promise.all([
    Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "cameraId", select: "cameraName" })
      .lean(),
    Event.countDocuments(filter),
  ]);
  const eventResponses = events.map((event) => {
    const populatedCamera =
      typeof event.cameraId === "object" && event.cameraId !== null
        ? (event.cameraId as PopulatedCamera)
        : undefined;

    return {
      ...event,
      cameraId: populatedCamera?._id ?? event.cameraId,
      cameraName: populatedCamera?.cameraName ?? event.cameraName,
    };
  });
  const totalPages = Math.ceil(totalItems / limit);
  const lastPage = totalPages || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json({
    success: true,
    data: {
      events: eventResponses,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        lastPage,
        currentPageItems: eventResponses.length,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    },
    message: "Events fetched successfully",
  });
});

eventsRouter.patch("/:id", async (req, res) => {
  const { isResolved } = req.body;
  const eventId = req.params.id as string;
  myLogger.log(["===== RESOLVING EVENT =====\n", `Event id: ${eventId}`]);

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { isResolved },
      { upsert: true },
    );
    myLogger.log(`===== EVENT RESOLVED WITH ID: ${eventId} ======`);
    res.json({
      success: true,
      data: event,
      message: `Event type: ${event?.eventType} has been resolved with event-id: ${event?._id}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomAppError(error.message, 500);
    } else {
      throw new CustomAppError("Something went wrong", 500);
    }
  }
});

export default eventsRouter;
