import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import storeRoutes from "./routes/stores.js";
import reasonRoutes from "./routes/loss-reasons.js";
import lossRoutes from "./routes/losses.js";
import salesRoutes from "./routes/sales.js";
import metricsRoutes from "./routes/metrics.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";
import { healthCheck } from "./services/db.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(morgan("dev"));

app.get("/health", async (_req, res) => {
  const ok = await healthCheck();
  res.json({ status: "ok", db: ok.ok });
});

app.use("/auth", authRoutes);

app.use(requireAuth);
app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/loss-reasons", reasonRoutes);
app.use("/losses", lossRoutes);
app.use("/loss-records", lossRoutes);
app.use("/sales", salesRoutes);
app.use("/metrics", metricsRoutes);

app.use(errorHandler);

export default app;
