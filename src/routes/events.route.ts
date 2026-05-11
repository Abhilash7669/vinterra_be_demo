import { CustomAppError } from "@/lib/utils/error.utils.js";
import Event from "@/models/events.model.js";
import { Router } from "express";

const eventsRouter = Router();

eventsRouter.get("/", async (req, res) => {
  const items = Number(req.query.items) || 100;
  const page = Number(req.query.page) || 1;
  const skip = page > 1 ? (page - 1) * items : 0;

  const filter = Object.entries(req.query).reduce<Record<string, unknown>>(
    (queryFilter, [key, value]) => {
      if (value === undefined) return queryFilter;
      if (key === "items" || key === "page") return queryFilter;

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

  const events = await Event.find(filter).skip(skip).limit(items);
  console.log(events, "EVENTS");
  res.json({
    success: true,
    data: events,
    message: "Events fetched successfully",
  });
});

eventsRouter.patch("/:id", async (req, res) => {
  const { isResolved } = req.body;
  const eventId = req.params.id as string;
  console.log(eventId, "EVENT ID");
  console.log(isResolved, "IS RESOLVED");
  console.log(typeof isResolved, "Type of isResolved");
  // const updatedEvent =

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { isResolved },
      { upsert: true },
    );

    res.json({
      success: true,
      data: event,
      message: `${event?.eventType} has been resolved with id: ${event?._id}`,
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
