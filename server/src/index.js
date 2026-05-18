import "./load-env.js";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employees.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

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

app.use(notFoundHandler);
app.use(errorHandler);

await connectDb();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
