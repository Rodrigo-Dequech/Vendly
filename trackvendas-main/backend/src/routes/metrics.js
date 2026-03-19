import { Router } from "express";
import { storeMetrics, networkMetrics } from "../controllers/metricsController.js";

const router = Router();

router.get("/store/:storeId", storeMetrics);
router.get("/network", networkMetrics);

export default router;
