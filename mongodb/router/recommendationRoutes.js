import express from "express";
import { getRecommendations } from "../controller/recommendationControl.js";

const router = express.Router();

// GET /api/recommendations/:productId?limit=6
// Public — no auth required
router.get("/:productId", getRecommendations);

export default router;
