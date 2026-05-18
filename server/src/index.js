import "./load-env.js";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employees.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("FATAL: Set JWT_SECRET in server/.env or server/.env.local");
  process.exit(1);
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/ai", aiRoutes);

const spaIndex = path.join(PUBLIC_DIR, "index.html");
const serveSpa = fs.existsSync(spaIndex);

if (serveSpa) {
  app.use(express.static(PUBLIC_DIR));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.originalUrl.startsWith("/api")) return next();
    return res.sendFile(spaIndex);
  });
} else {
  app.get("/", (_req, res) =>
    res.json({
      service: "perfinsight-api",
      hint: "No built SPA found (development): run client with Vite; production Docker embeds React in /public.",
      health: "/health",
    })
  );
}

app.use(notFoundHandler);
app.use(errorHandler);

await connectDb();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}${serveSpa ? " (+ static SPA)" : ""}`);
});
