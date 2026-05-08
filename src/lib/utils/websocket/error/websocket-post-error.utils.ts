import { CustomAppError } from "@/lib/utils/error.utils.js";

export async function onSocketPostError(err: Error) {
  throw new CustomAppError(err.message || "Post Socket error", 500);
}
