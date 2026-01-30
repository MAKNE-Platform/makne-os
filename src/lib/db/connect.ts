// lib/db/connect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

declare global {
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (!global.mongooseConn) {
    global.mongooseConn = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  await global.mongooseConn;
}
