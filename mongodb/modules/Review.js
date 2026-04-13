import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product:        { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user:           { type: mongoose.Schema.Types.ObjectId, ref: "users",   required: true },
    userName:       { type: String, required: true },
    rating:         { type: Number, required: true, min: 1, max: 5 },
    comment:        { type: String, required: true, trim: true },
    verified:       { type: Boolean, default: false },
    sentiment:      { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" },
    sentimentScore: { type: Number, default: 0 },   // -1.0 to +1.0
    flagged:        { type: Boolean, default: false }, // admin review flag
    dismissed:      { type: Boolean, default: false }, // admin dismissed the flag
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
