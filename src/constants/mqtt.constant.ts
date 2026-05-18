import {
  APP_PORT,
  MQTT_CERT_PATH,
  MQTT_HOSTNAME,
  MQTT_TLS_REQUIRED,
  MQTT_WEBSOCKET_PORT,
} from "@/config/env.config.js";
import mqtt from "mqtt";
import fs from "fs";
import path from "path";

type WebsocketProtocol = "ws" | "wss";

function readCertFile(filePath: string) {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(resolvedPath);
}

export const MQTT_DETAILS = {
  tlsRequired: MQTT_TLS_REQUIRED === "false" ? false : true,
  hostname: MQTT_HOSTNAME,
  websocketPort: MQTT_WEBSOCKET_PORT,
  port: APP_PORT,
  identifier: `mock-client-${Math.random() * 52}`,
  username: "mock-user",
  browserId: `mock-browser-${Math.random() * 12}`,
  eventTopics: {
    siteTopics: {
      test: "server-test-value",
    },
  },
  authorisationTokens: {},
};

export const MQTT_KEEP_ALIVE = 10;
export const MQTT_RECONNECT_DELAY_MS = 8000;

const PROTOCOL: WebsocketProtocol = MQTT_DETAILS.tlsRequired ? "wss" : "ws";

export const MQTT_BROKER_URL = `${PROTOCOL}://${MQTT_DETAILS.hostname}:${MQTT_DETAILS.websocketPort}/`;

export const MQTT_OPTIONS: mqtt.IClientOptions | undefined = {
  clientId: MQTT_DETAILS.identifier,
  username: MQTT_DETAILS.username,
  keepalive: MQTT_KEEP_ALIVE,
  reconnectPeriod: MQTT_RECONNECT_DELAY_MS,
  clean: true,
  password: "Server-Hello-World",
  rejectUnauthorized: false,
  cert: MQTT_CERT_PATH === "null" ? "" : readCertFile(MQTT_CERT_PATH!),
  // key: MQTT_KEY_PATH === "null" ? "" : readCertFile(MQTT_KEY_PATH!),
};

// === MQTT TOPICS === //
export const SUBSCRIBE_TOPIC = "device/events";
