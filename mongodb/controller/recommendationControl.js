import Order from "../modules/Order.js";
import Product from "../modules/Product.js";

// ─────────────────────────────────────────────
//  Maths helpers
// ─────────────────────────────────────────────

/** Dot product of two sparse vectors represented as plain objects. */
const dot = (a, b) => {
    let sum = 0;
    for (const key of Object.keys(a)) {
        if (b[key]) sum += a[key] * b[key];
    }
    return sum;
};

/** Euclidean magnitude of a sparse vector. */
const magnitude = (v) => Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0));

/** Cosine similarity between two sparse vectors (returns 0 if either is zero). */
const cosineSim = (a, b) => {
    const denom = magnitude(a) * magnitude(b);
    return denom === 0 ? 0 : dot(a, b) / denom;
};

// ─────────────────────────────────────────────
//  Core collaborative filtering (item-based)
// ─────────────────────────────────────────────

/**
 * Builds an item-item similarity matrix from order history.
 *
 * Approach  — Item-based Collaborative Filtering (Memory-based)
 *   1. Build a user-item matrix  M[userId][productId] = total qty purchased
 *   2. Treat each product as a vector of user ratings (sparse)
 *   3. Compute pairwise cosine similarity between all product vectors
 *
 * Returns: Map<productId, Map<productId, similarity>>
 */
const buildItemSimilarityMatrix = (orders) => {
    // Step 1: user-item matrix
    const userItem = {}; // { userId: { productId: qty } }

    for (const order of orders) {
        const uid = String(order.userId);
        if (!userItem[uid]) userItem[uid] = {};
        for (const item of order.items) {
            const pid = String(item.productId);
            userItem[uid][pid] = (userItem[uid][pid] || 0) + item.quantity;
        }
    }

    // Step 2: item-user vectors (transpose)
    const itemVec = {}; // { productId: { userId: qty } }
    for (const [uid, products] of Object.entries(userItem)) {
        for (const [pid, qty] of Object.entries(products)) {
            if (!itemVec[pid]) itemVec[pid] = {};
            itemVec[pid][uid] = qty;
        }
    }

    // Step 3: pairwise cosine similarity
    const productIds = Object.keys(itemVec);
    const sim = {}; // { pid: { pid: score } }

    for (let i = 0; i < productIds.length; i++) {
        const pi = productIds[i];
        if (!sim[pi]) sim[pi] = {};
        for (let j = i + 1; j < productIds.length; j++) {
            const pj = productIds[j];
            const score = cosineSim(itemVec[pi], itemVec[pj]);
            if (score > 0) {
                sim[pi][pj] = score;
                if (!sim[pj]) sim[pj] = {};
                sim[pj][pi] = score;
            }
        }
    }

    return sim;
};

/**
 * Given a target productId and a similarity matrix,
 * returns sorted [{ productId, score }] excluding the target itself.
 */
const getTopSimilar = (targetId, simMatrix, topN = 8) => {
    const row = simMatrix[String(targetId)] || {};
    return Object.entries(row)
        .map(([pid, score]) => ({ productId: pid, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
};

// ─────────────────────────────────────────────
//  Route handler
// ─────────────────────────────────────────────

/**
 * GET /api/recommendations/:productId
 *
 * Query params:
 *   limit  – number of products to return (default 6, max 12)
 *
 * Strategy:
 *   1. Run item-based CF on all order history
 *   2. If CF yields < 4 results (cold-start / sparse data), pad with
 *      same-category products sorted by stock (popularity proxy)
 */
export const getRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;
        const limit = Math.min(parseInt(req.query.limit) || 6, 12);

        // ── Fetch data ──────────────────────────────────────────────────
        const [orders, targetProduct, allProducts] = await Promise.all([
            Order.find({}, { userId: 1, items: 1 }).lean(),
            Product.findById(productId).lean(),
            Product.find({ status: "Active" }, {
                _id: 1, name: 1, category: 1, price: 1,
                discountPrice: 1, imageUpload: 1, stock: 1
            }).lean()
        ]);

        if (!targetProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // ── Collaborative Filtering ─────────────────────────────────────
        let cfRecommendedIds = [];

        if (orders.length > 0) {
            const simMatrix = buildItemSimilarityMatrix(orders);
            const topSimilar = getTopSimilar(productId, simMatrix, limit);
            cfRecommendedIds = topSimilar.map(x => x.productId);
        }

        // ── Build result set ────────────────────────────────────────────
        const productMap = Object.fromEntries(allProducts.map(p => [String(p._id), p]));

        // Start with CF results (in similarity order)
        const resultSet = [];
        const seen = new Set([String(productId)]);

        for (const pid of cfRecommendedIds) {
            if (productMap[pid] && !seen.has(pid)) {
                resultSet.push({ ...productMap[pid], _recommendationType: "collaborative" });
                seen.add(pid);
            }
        }

        // Cold-start fallback: pad with same-category products
        if (resultSet.length < limit) {
            const fallbacks = allProducts
                .filter(p => p.category === targetProduct.category && !seen.has(String(p._id)))
                .sort((a, b) => b.stock - a.stock); // stock as popularity proxy

            for (const p of fallbacks) {
                if (resultSet.length >= limit) break;
                resultSet.push({ ...p, _recommendationType: "category_fallback" });
                seen.add(String(p._id));
            }
        }

        // Last-resort: fill with any active products
        if (resultSet.length < limit) {
            const others = allProducts
                .filter(p => !seen.has(String(p._id)))
                .sort(() => Math.random() - 0.5);

            for (const p of others) {
                if (resultSet.length >= limit) break;
                resultSet.push({ ...p, _recommendationType: "general" });
            }
        }

        // ── Format for frontend ─────────────────────────────────────────
        const formatted = resultSet.slice(0, limit).map(p => ({
            _id:         p._id,
            name:        p.name,
            category:    p.category,
            price:       p.price,
            discountPrice: p.discountPrice,
            image:       p.imageUpload?.[0] || null,
            _recommendationType: p._recommendationType
        }));

        res.status(200).json({
            success: true,
            productId,
            totalOrders: orders.length,
            data: formatted
        });

    } catch (error) {
        console.error("[Recommendations]", error.message);
        res.status(500).json({ success: false, message: "Error generating recommendations", error: error.message });
    }
};
