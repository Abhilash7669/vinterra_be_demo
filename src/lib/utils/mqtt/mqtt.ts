import { wss } from "@/app.js";
import {
  MQTT_BROKER_URL,
  MQTT_OPTIONS,
  SUBSCRIBE_TOPIC,
} from "@/constants/mqtt.constant.js";
import {
  EventType,
  type AnalyticsMetadata,
} from "@/interfaces/event.interface.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import { broadcastMessage } from "@/lib/utils/websocket/websocket.utils.js";
import {
  saveEvent,
  transformAnalyticsMetadataToEvent,
} from "@/service/event.service.js";
import mqtt from "mqtt";

let client: mqtt.MqttClient;

export async function connectMqtt() {
  myLogger.log("======= MQTT CONNECTING =====");
  try {
    client = await mqtt.connectAsync(MQTT_BROKER_URL, MQTT_OPTIONS);
  } catch (error) {
    myLogger.log(["====== ERROR CONNECTING TO MQTT =====\n", error]);
    if (error instanceof Error) {
      throw new CustomAppError(error.message, 500);
    } else {
      throw new CustomAppError(JSON.stringify(error), 500);
    }
  }
  myLogger.log("========= MQTT-CONNECTED =========");
  client.subscribe(SUBSCRIBE_TOPIC, () => {
    myLogger.log(
      `========= Subscribing to topic: ${SUBSCRIBE_TOPIC} =========`,
    );
  });

  client.on("message", async (topic, payload) => {
    myLogger.log([
      "==================== LIFE-CYCLE-START ==================== \n",
      `========== MQTT HIT ==========\n`,
      `Topic received: ${topic}\n`,
      `Payload: ${payload.toString()}`,
    ]);

    try {
      const deviceEventMetadata = JSON.parse(
        payload.toString(),
      ) as AnalyticsMetadata;
      const event = transformAnalyticsMetadataToEvent(deviceEventMetadata);
      myLogger.log("==== SAVING EVENT =====");
      const savedEvent = await saveEvent(event);
      myLogger.log(`===== MONGODB SAVED EVENT: ${savedEvent} =====`);
      const isWeaponOrAbandonment =
        event.eventType === "weapon" || event.eventType === "abandonment";

      const isFrisking = event.eventType === "frisking";

      // logging
      switch (event.eventType) {
        case "weapon":
          myLogger.log("========= EVENT TYPE: WEAPON =========");
          break;
        case "abandonment":
          myLogger.log("========= EVENT TYPE: ABANDONMENT =========");
          break;
        case "frisking":
          myLogger.log("========= EVENT TYPE: FRISKING =========");
          break;
        default:
          myLogger.log("========= EVENT TYPE: UNKNOWN =========");
          break;
      }

      if (isWeaponOrAbandonment) {
        myLogger.log("==== BROADCASTING LIVE NOTIFICATION OVER WEBSOCKET ===");
        myLogger.log([
          `===== Event id: ${savedEvent._id} =====\n`,
          `===== Camera name: ${savedEvent.cameraName} ====\n`,
        ]);
        broadcastMessage({ type: "live", data: savedEvent }, wss);
      }

      if (!event.isResolved && isFrisking) {
        myLogger.log(
          "==== BROADCASTING UN-RESOLVED NOTIFICATION OVER WEBSOCKET ===",
        );
        myLogger.log([
          `===== Event id: ${savedEvent._id} =====\n`,
          `===== Camera name: ${savedEvent.cameraName} ====\n`,
        ]);
        broadcastMessage({ type: "un-resolved", data: savedEvent }, wss);
      }

      myLogger.log("==================== LIFE-CYCLE-END ====================");
    } catch (error) {
      myLogger.log([
        error instanceof Error ? error.message : JSON.stringify(error),
        "Error handling MQTT event",
      ]);
      throw new CustomAppError(
        error instanceof Error ? error.message : JSON.stringify(error),
        500,
      );
    }
  });

  client.on("reconnect", () => {
    console.log("======= MQTT RECONNECTING =====");
  });

  client.on("close", () => {
    console.log("======= MQTT CONNECTION CLOSED =====");
  });

  client.on("offline", () => {
    console.log("======= MQTT OFFLINE =====");
  });

  client.on("error", (error) => {
    console.log("======= MQTT ERROR =====", error.message);
  });

  return client;
}

export function getMqttClient() {
  if (!client) {
    myLogger.log("MQTT client not initialized");
    return;
  }
  return client;
}
