import { Router } from "express";
import { getStores, postStore, putStore, removeStore } from "../controllers/storeController.js";

const router = Router();

router.get("/", getStores);
router.post("/", postStore);
router.put("/:id", putStore);
router.delete("/:id", removeStore);

export default router;
