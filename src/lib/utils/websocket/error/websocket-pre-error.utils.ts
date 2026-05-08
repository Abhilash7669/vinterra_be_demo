import { CustomAppError } from "@/lib/utils/error.utils.js";

export async function onSocketPreError(err?: Error) {
  throw new CustomAppError(err?.message || "Socket pre-error", 500);
}
