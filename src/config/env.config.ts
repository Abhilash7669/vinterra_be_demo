import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV === "development" ? "local" : "production"}`,
});

export const {
  APP_PORT,
  APP_BASE_URL,
  DB_URI,
  MQTT_WEBSOCKET_PORT,
  MQTT_TLS_REQUIRED,
  MQTT_HOSTNAME,
} = process.env;
