import Review from "../modules/Review.js";
import Order  from "../modules/Order.js";
import User   from "../modules/Users.js";
import { analyzeSentiment } from "../utils/sentiment.js";

// GET /api/review/:productId — public
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .sort({ createdAt: -1 });

        const avgRating = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.status(200).json({ success: true, data: reviews, avgRating: Number(avgRating), total: reviews.length });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
    }
};

// POST /api/review/:productId — auth required
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId    = req.user.id;
        const productId = req.params.productId;

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: "Rating and comment are required." });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
        }

        const existing = await Review.findOne({ product: productId, user: userId });
        if (existing) {
            return res.status(409).json({ success: false, message: "You have already reviewed this product." });
        }

        const verifiedOrder = await Order.findOne({
            userId,
            orderStatus: "Delivered",
            "items.productId": productId,
        });

        const userDoc = await User.findById(userId).select("firstName lastName email");
        const userName = userDoc ? `${userDoc.firstName} ${userDoc.lastName || ""}`.trim() : "Anonymous";

        // Run sentiment analysis
        const { sentiment, sentimentScore, flagged } = analyzeSentiment(comment, Number(rating));

        const review = new Review({
            product:  productId,
            user:     userId,
            userName,
            rating:   Number(rating),
            comment:  comment.trim(),
            verified: !!verifiedOrder,
            sentiment,
            sentimentScore,
            flagged,
        });

        await review.save();
        res.status(201).json({ success: true, message: "Review submitted successfully.", data: review });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "You have already reviewed this product." });
        }
        res.status(500).json({ success: false, message: "Error submitting review", error: error.message });
    }
};

// DELETE /api/review/:reviewId — user can delete their own review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Review not found." });
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        await review.deleteOne();
        res.status(200).json({ success: true, message: "Review deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting review", error: error.message });
    }
};

// ── ADMIN ENDPOINTS ──────────────────────────────────────────────────────────

// GET /api/review/admin/all — all reviews with product info
export const adminGetAllReviews = async (req, res) => {
    try {
        const { sentiment, flagged, page = 1, limit = 30 } = req.query;
        const filter = {};
        if (sentiment) filter.sentiment = sentiment;
        if (flagged === 'true') filter.flagged = true;

        const skip = (Number(page) - 1) * Number(limit);
        const [reviews, total] = await Promise.all([
            Review.find(filter)
                .populate('product', 'name imageUpload category')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Review.countDocuments(filter),
        ]);

        // Summary stats — also count docs with missing sentiment field as neutral
        const [pos, neu, neg, flag] = await Promise.all([
            Review.countDocuments({ sentiment: 'positive' }),
            Review.countDocuments({ $or: [{ sentiment: 'neutral' }, { sentiment: { $exists: false } }] }),
            Review.countDocuments({ sentiment: 'negative' }),
            Review.countDocuments({ flagged: true, dismissed: { $ne: true } }),
        ]);

        res.status(200).json({
            success: true,
            data: reviews,
            total,
            page: Number(page),
            stats: { positive: pos, neutral: neu, negative: neg, flaggedCount: flag },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
    }
};

// PUT /api/review/admin/:reviewId/dismiss — dismiss flag
export const adminDismissFlag = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.reviewId,
            { dismissed: true, flagged: false },
            { new: true }
        );
        if (!review) return res.status(404).json({ success: false, message: "Review not found." });
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error dismissing flag", error: error.message });
    }
};

// POST /api/review/admin/reanalyze — re-run sentiment on all reviews
export const adminReanalyzeAll = async (req, res) => {
    try {
        const reviews = await Review.find({});
        let updated = 0;
        for (const review of reviews) {
            const { sentiment, sentimentScore, flagged } = analyzeSentiment(review.comment, review.rating);
            review.sentiment      = sentiment;
            review.sentimentScore = sentimentScore;
            review.flagged        = flagged;
            review.dismissed      = review.dismissed || false;
            await review.save();
            updated++;
        }
        res.status(200).json({ success: true, message: `Re-analyzed ${updated} reviews.`, updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error re-analyzing', error: error.message });
    }
};

// DELETE /api/review/admin/:reviewId — admin force-delete
export const adminDeleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Review not found." });
        res.status(200).json({ success: true, message: "Review deleted by admin." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting review", error: error.message });
    }
};
