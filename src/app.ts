import { APP_PORT, DB_URI } from "@/config/env.config.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import router from "@/routes/index.route.js";
import express from "express";
import cors from "cors";
import { createServer, IncomingMessage } from "http";
import { CORS_OPTIONS } from "@/config/cors.config.js";
import { errorMiddleware } from "@/middleware/error.middleware.js";
import connectToMongoDb from "@/database/mongodb.db.js";
import { connectMqtt } from "@/lib/utils/mqtt/mqtt.js";
import {
  dummyBackendFriskingEvent,
  dummyBackendWeaponEvent,
  dummyDeviceFriskingMetadata,
  dummyDeviceWeaponMetadata,
  saveEvent,
} from "@/service/event.service.js";
import { WebSocketServer, WebSocket, Server } from "ws";
import { onSocketPostError } from "@/lib/utils/websocket/error/websocket-post-error.utils.js";
import { broadcastMessage } from "@/lib/utils/websocket/websocket.utils.js";
import { v4 } from "uuid";

// ==== SERVERS ==== //
const app = express();
export const server = createServer(app);

// === WEB-SOCKET === //

export const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws, req) => {
  console.log("connect");
  setTimeout(() => {
    broadcastMessage(
      {
        id: v4(),
        type: "face-detection",
        camera: undefined,
        priority: "high",
        status: "un-resolved",
        createdAt: "2026-05-06T08:15:00Z",
      },
      wss,
    );
  }, 3000);
  ws.on("error", onSocketPostError);
  ws.on("message", (data: WebSocket.RawData) => {
    const _data = data.toString();
    myLogger.log(_data);
  });
});
wss.on("close", () => {
  myLogger.log("Connection closed");
});

// ===== UTILITIES ==== //
app.use(cors(CORS_OPTIONS));
app.use(express.json()); // to parse incoming json data

// ==== INITIATE ROUTES ==== //
app.use(router);

// ==== INITIATE ERROR MIDDLEWARE ==== //
app.use(errorMiddleware);

// ==== RUN SERVER ==== //
server.listen(APP_PORT, async (error?: Error) => {
  if (error) {
    myLogger.log([error, "Error on listening to port"]);
    return;
  }

  try {
    // myLogger.log(dummyDeviceWeaponMetadata);
    await Promise.all([connectToMongoDb(DB_URI as string), connectMqtt()]);
    myLogger.log(`Listening on PORT: ${APP_PORT}`);
    myLogger.log("==== CREATING EVENT ===");
    const eventCreated = await saveEvent(dummyBackendWeaponEvent);
    console.log(eventCreated, "CREATED EVENT!");
  } catch (error) {
    myLogger.log([error, "Error connecting mongo or mqtt"]);
    process.exit(1);
  }
});
