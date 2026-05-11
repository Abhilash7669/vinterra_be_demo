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
  try {
    client = await mqtt.connectAsync(MQTT_BROKER_URL, MQTT_OPTIONS);
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomAppError(error.message, 500);
    } else {
      throw new CustomAppError(JSON.stringify(error), 500);
    }
  }
  myLogger.log("MQTT-CONNECTED");
  client.subscribe(SUBSCRIBE_TOPIC, () => {
    myLogger.log(`Subscribing to ${SUBSCRIBE_TOPIC}`);
  });

  client.on("message", async (topic, payload) => {
    myLogger.log([
      `Topic received: ${topic}\n`,
      `Payload: ${payload.toString()}`,
    ]);

    try {
      const deviceEventMetadata = JSON.parse(
        payload.toString(),
      ) as AnalyticsMetadata;
      const event = transformAnalyticsMetadataToEvent(deviceEventMetadata);
      const savedEvent = await saveEvent(event);
      const isWeaponOrAbandonment =
        event.eventType === "weapon" || event.eventType === "abandonment";

      if (isWeaponOrAbandonment) {
        console.log(savedEvent);
        broadcastMessage({ type: "live", data: savedEvent }, wss);
      }

      if (!event.isResolved && !isWeaponOrAbandonment) {
        console.log(savedEvent);
        broadcastMessage({ type: "un-resolved", data: savedEvent }, wss);
      }
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

  return client;
}

export function getMqttClient() {
  if (!client) {
    myLogger.log("MQTT client not initialized");
    return;
  }
  return client;
}
