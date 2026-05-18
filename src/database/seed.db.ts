import { ICamera } from "@/interfaces/camera.interface.js";
import { myLogger } from "@/lib/logger/my-logger.js";
import Camera from "@/models/camera.model.js";
import User from "@/models/user.model.js";
import { readFile } from "node:fs/promises";
import path from "node:path";

type SeedUser = {
  name?: string;
  email: string;
  password: string;
};

const SEED_DIR = path.join(process.cwd(), "src", "database", "seeds");

async function readSeedFile<T>(fileName: string): Promise<T[]> {
  const seedPath = path.join(SEED_DIR, fileName);
  const seedContent = await readFile(seedPath, "utf-8");
  return JSON.parse(seedContent) as T[];
}

async function seedDemoUsers() {
  const users = await readSeedFile<SeedUser>("users.json");

  for (const user of users) {
    await User.updateOne(
      { email: user.email },
      {
        $set: {
          email: user.email,
          password: user.password,
          ...(user.name ? { name: user.name } : {}),
        },
      },
      { upsert: true },
    );
  }
}

async function seedDemoCameras() {
  const cameras = await readSeedFile<ICamera>("cameras.json");

  for (const camera of cameras) {
    await Camera.updateOne(
      { cameraName: camera.cameraName },
      { $set: camera },
      { upsert: true },
    );
  }
}

export async function seedDemoData() {
  myLogger.log("====== SEEDING DEMO DATA FROM JSON =====");

  await seedDemoUsers();
  await seedDemoCameras();

  myLogger.log("====== DEMO DATA SEED COMPLETE =====");
}
