import { ICamera } from "@/interfaces/camera.interface.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import { getCameras } from "@/service/camera.service.js";
import { TResponseDTO } from "@/types/response.types.js";
import { Router } from "express";

const cameraRouter = Router();

cameraRouter.get("/", async (req, res) => {
  const limit = Number(req.query.limit) || 500;
  const page = Number(req.query.page) || 1;
  const skip = page > 1 ? (page - 1) * limit : 0;

  const filter = Object.entries(req.query).reduce<Record<string, unknown>>(
    (queryFilter, [key, value]) => {
      if (value === undefined) return queryFilter;
      if (key === "limit" || key === "page") return queryFilter;

      queryFilter[key] = value;

      return queryFilter;
    },
    {},
  );

  const cameras = await getCameras({ limit, skip, filter });

  if (cameras) {
    myLogger.log(cameras.length);
    res.json({ cameras });
  }
});

export default cameraRouter;
