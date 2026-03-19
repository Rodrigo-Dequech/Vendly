import { Router } from "express";
import { getReasons, postReason, removeReason } from "../controllers/lossReasonController.js";

const router = Router();

router.get("/", getReasons);
router.post("/", postReason);
router.delete("/:id", removeReason);

export default router;
