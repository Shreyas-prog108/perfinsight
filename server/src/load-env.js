/**
 * Loaded first so MONGODB_URI / JWT_SECRET from .env.local exist before routes run.
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(serverRoot, ".env") });
dotenv.config({ path: path.join(serverRoot, ".env.local"), override: true });
