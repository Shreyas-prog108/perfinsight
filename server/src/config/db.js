import mongoose from "mongoose";

/** Prefer MONGODB_URI; also accept common alt names deploy tools use */
function mongoUriFromEnv() {
  const candidates = [
    process.env.MONGODB_URI?.trim?.(),
    process.env.MONGO_URI?.trim?.(),
    process.env.DATABASE_URL?.trim?.(),
  ].filter(Boolean);
  const hit = candidates.find(
    (s) => s.startsWith("mongodb://") || s.startsWith("mongodb+srv://")
  );
  return hit ?? null;
}

export async function connectDb() {
  const uri = mongoUriFromEnv() ?? "mongodb://127.0.0.1:27017/employee_performance";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
