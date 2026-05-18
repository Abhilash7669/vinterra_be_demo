import { APP_BASE_URL, APP_LAN_BASE_URL } from "@/config/env.config.js";
import { CorsOptions } from "cors";

const isProduction = process.env.NODE_ENV === "production";

const useOrigins = isProduction
  ? [APP_BASE_URL as string]
  : [APP_BASE_URL as string, APP_LAN_BASE_URL as string];

export const CORS_OPTIONS: CorsOptions = {
  origin: "*", // for now
  // origin: useOrigins,
  // credentials: true,
};
