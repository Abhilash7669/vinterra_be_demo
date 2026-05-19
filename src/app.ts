import { APP_PORT, DB_URI } from "@/config/env.config.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import router from "@/routes/index.route.js";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { CORS_OPTIONS } from "@/config/cors.config.js";
import { errorMiddleware } from "@/middleware/error.middleware.js";
import connectToMongoDb from "@/database/mongodb.db.js";
import { seedDemoData } from "@/database/seed.db.js";
import { connectMqtt } from "@/lib/utils/mqtt/mqtt.js";
import { WebSocketServer, WebSocket } from "ws";
import { onSocketPostError } from "@/lib/utils/websocket/error/websocket-post-error.utils.js";
import { saveCameras } from "@/service/camera.service.js";
import cookieParser from "cookie-parser";
import { broadcastMessage } from "@/lib/utils/websocket/websocket.utils.js";
import { v4 } from "uuid";
import { onSocketPreError } from "@/lib/utils/websocket/error/websocket-pre-error.utils.js";
import { AliveWebSocket } from "@/types/websocket.types.js";

// ==== SERVERS ==== //
const app = express();
export const server = createServer(app);

// ===== UTILITIES ==== //
app.use(cors(CORS_OPTIONS));
app.use(express.json()); // to parse incoming json data
app.use(cookieParser()); // parse cookies

const SOCKET_CLIENTS = new Map<string, WebSocket>();

// === WEB-SOCKET === //
export const wss = new WebSocketServer({ server: server, path: "/ws" });

wss.on("connection", (ws: AliveWebSocket, req) => {
  // todo: uncomment when implementing auth
  // myLogger.log([req.headers.cookie, "cookie"]);
  // if (!req.headers.cookie) {
  //   myLogger.log("Destroying socket");
  //   socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  //   socket.destroy();
  //   return;
  // }
  // const socketClientKey = req.headers.cookie;

  ws.isAlive = true;

  // response from browser
  ws.on("pong", () => {
    myLogger.log("===== RECEIVED WEBSOCKET PONG =====");
    ws.isAlive = true;
  });

  const socketClientKey = v4();
  SOCKET_CLIENTS.set(socketClientKey, ws);

  myLogger.log(`===== ADDING WEBSOCKET CLIENT: ${socketClientKey} =====`);
  myLogger.log("DUMMY");
  myLogger.log("========= WEBSOCKET CONNECTED =========");
  ws.on("error", onSocketPostError);
  ws.once("close", (code, reason) => {
    SOCKET_CLIENTS.delete(socketClientKey);
    myLogger.log([
      `=== REMOVING a WEBSOCKET CLIENT: ${socketClientKey} ======`,
      `code: ${code}`,
      `reason: ${reason.toString()}`,
    ]);
  });
  ws.on("message", (data: WebSocket.RawData) => {
    const _data = data.toString();
    myLogger.log([
      `======= WEBSOCKET RECEIVED MESSAGE ====\n`,
      `message: ${_data}`,
    ]);
  });
});

const heartbeatInterval = setInterval(() => {
  if (!wss) {
    myLogger.log("NO WEBSOCKET INSTANCE FOUND");
    return;
  }
  wss.clients.forEach((_ws) => {
    const _socket = _ws as AliveWebSocket;
    if (_socket.isAlive === false) {
      myLogger.log("===== TERMINATING DEAD WEBSOCKET CLIENT =====");
      _socket.terminate();
      return;
    }
    myLogger.log("===== PINGING CLIENT =====");
    _socket.isAlive = false;
    _socket.ping();
  });
}, 10000);

wss.on("close", () => {
  myLogger.log("Connection closed");
  clearInterval(heartbeatInterval);
});

// ==== INITIATE ROUTES ==== //
app.use(router);

// ==== INITIATE ERROR MIDDLEWARE ==== //
app.use(errorMiddleware);

async function bootstrap() {
  try {
    await connectToMongoDb(DB_URI as string);
    await seedDemoData();
    await connectMqtt();
    myLogger.log("====== CONNECTED WITH MONGODB && MQTT SUCCESSFULLY =====");
    // ==== RUN SERVER ==== //
    server.listen(APP_PORT, async (error?: Error) => {
      myLogger.log(`===== Listening on PORT: ${APP_PORT} =====`);
      if (error) {
        myLogger.log([error, "Error on listening to port"]);
        return;
      }
    });
  } catch (error) {
    myLogger.log([error, "Error connecting mongo or mqtt"]);
    process.exit(1);
  }
}

bootstrap();
