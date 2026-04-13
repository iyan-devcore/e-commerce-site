import express from "express";
import {
    getReviews,
    addReview,
    deleteReview,
    adminGetAllReviews,
    adminDismissFlag,
    adminDeleteReview,
    adminReanalyzeAll,
} from "../controller/reviewControl.js";
import { authMiddleware } from "../utils/authmiddleware.js";

const router = express.Router();

// Public
router.get("/:productId", getReviews);

// User routes (auth)
router.post("/:productId", authMiddleware, addReview);
router.delete("/:reviewId", authMiddleware, deleteReview);

// Admin routes
router.get("/admin/all", authMiddleware, adminGetAllReviews);
router.post("/admin/reanalyze", authMiddleware, adminReanalyzeAll);
router.put("/admin/:reviewId/dismiss", authMiddleware, adminDismissFlag);
router.delete("/admin/:reviewId", authMiddleware, adminDeleteReview);

export default router;
