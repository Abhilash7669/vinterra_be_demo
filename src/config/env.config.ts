import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV === "development" ? "local" : "production"}`,
});

export const {
  APP_PORT,
  APP_BASE_URL,
  APP_LAN_BASE_URL,
  DB_URI,
  MQTT_WEBSOCKET_PORT,
  MQTT_TLS_REQUIRED,
  MQTT_HOSTNAME,
  // MQTT_KEY_PATH,
  MQTT_CERT_PATH,
  JWT_SECRET,
} = process.env;
