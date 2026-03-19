import { Router } from "express";
import { getLosses, postLoss } from "../controllers/lossController.js";

const router = Router();

router.get("/", getLosses);
router.post("/", postLoss);

export default router;
