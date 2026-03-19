import { Router } from "express";
import { getSales, postSale } from "../controllers/salesController.js";

const router = Router();

router.get("/", getSales);
router.post("/", postSale);

export default router;
