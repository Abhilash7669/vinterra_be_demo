import { myLogger } from "@/lib/logger/my-logger.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import { connect } from "mongoose";

export default async function connectToMongoDb(dbUri: string) {
  if (!dbUri) throw new CustomAppError("No DB_URI found", 500);

  try {
    await connect(dbUri);
    myLogger.log("Connected to MONGODB");
  } catch (error) {
    throw new CustomAppError(JSON.stringify(error), 500);
  }
}
