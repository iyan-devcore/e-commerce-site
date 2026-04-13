import express from "express";
import { toggleWishlist, getWishlist } from "../controller/wishlistControl.js";
import { authMiddleware } from "../utils/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/toggle", toggleWishlist);
router.get("/", getWishlist);

export default router;
