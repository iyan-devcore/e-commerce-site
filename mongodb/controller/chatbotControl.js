import Product from "../modules/Product.js";
import Order from "../modules/Order.js";

// ─── Store policies baked into the system prompt ────────────────────────────
const STORE_POLICIES = `
STORE POLICIES:
- Store Name: TechStore
- Shipping: Free shipping on orders above Rs.999. Standard delivery 3-5 business days. Express delivery (1-2 days) available for Rs.99 extra.
- Returns: 7-day hassle-free return policy. Products must be unused and in original packaging. Initiate returns via the Profile page.
- Warranty: All electronics come with 1-year manufacturer warranty. Accessories carry 6-month warranty.
- Payment Methods: Credit/Debit Card, Cash on Delivery (COD) available.
- Order Tracking: Track orders from the Profile > My Orders section.
- Customer Support: Available Mon-Sat, 9AM-6PM IST. Email: support@techstore.com
- Cancellation: Orders can be cancelled within 2 hours of placing. After that contact support.
`;

/**
 * Builds context about the user's specific orders if they are logged in.
 */
const buildOrderContext = async (userId) => {
    if (!userId) return "USER STATUS: Guest (Not logged in). I cannot access personal order details.";
    
    try {
        const orders = await Order.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
            
        if (orders.length === 0) return "USER STATUS: Logged in. No previous orders found.";
        
        const lines = orders.map(o => {
            const date = new Date(o.createdAt).toLocaleDateString("en-IN");
            const items = o.items.map(i => `${i.name} (x${i.quantity})`).join(", ");
            return `- Order ID: #${String(o._id).slice(-8).toUpperCase()} | Date: ${date} | Status: ${o.orderStatus} | Total: Rs.${o.total} | Items: ${items}`;
        });
        
        return `USER STATUS: Logged in.\nMOST RECENT ORDERS:\n` + lines.join("\n");
    } catch (e) {
        return "Order history temporarily unavailable.";
    }
};

/**
 * Builds a live product catalogue snapshot from MongoDB (max 40 products).
 * Trimmed to keep context window manageable for a 4B local model.
 */
const buildProductContext = async () => {
    try {
        const products = await Product.find({ status: "Active" })
            .select("name category price discountPrice stock description")
            .limit(40)
            .lean();

        if (products.length === 0) return "No products currently available.";

        const lines = products.map(p => {
            const price = p.discountPrice > 0
                ? `Rs.${p.discountPrice} (was Rs.${p.price})`
                : `Rs.${p.price}`;
            const stock = p.stock > 0 ? `In stock (${p.stock} units)` : "Out of stock";
            return `- ${p.name} | ${p.category} | ${price} | ${stock}`;
        });

        return `AVAILABLE PRODUCTS (${products.length} items):\n` + lines.join("\n");
    } catch (e) {
        return "Product catalogue temporarily unavailable.";
    }
};

/**
 * POST /api/chatbot/chat
 * Body: { message: string, history: [{role, content}] }
 *
 * Forwards to a locally-running Ollama instance.
 * Model: phi3:mini (3.8B) — change OLLAMA_MODEL in .env to override.
 */
export const chat = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ success: false, message: "Message is required." });
    }

    const ollamaUrl   = process.env.OLLAMA_URL   || "http://localhost:11434";
    const ollamaModel = process.env.OLLAMA_MODEL  || "phi3:mini";

    try {
        // Build live context snippets
        const [productContext, orderContext] = await Promise.all([
            buildProductContext(),
            buildOrderContext(req.user?.id)
        ]);

        // System prompt — store-aware, user-aware, concise
        const systemPrompt = `You are a helpful customer support assistant for TechStore.

${STORE_POLICIES}

${productContext}

${orderContext}

Instructions:
- If a user asks about their order status, check the "MOST RECENT ORDERS" section above.
- If they are a Guest, explain they need to log in to see order details.
- Be concise (2-4 sentences max), professional and warm.
- Today's date: ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;

        // Build Ollama messages array (OpenAI-compatible format)
        const messages = [
            { role: "system", content: systemPrompt },
            // Include recent conversation history (last 6 turns to stay within context)
            ...history.slice(-6),
            { role: "user", content: message.trim() }
        ];

        // Call Ollama REST API
        const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model:    ollamaModel,
                messages: messages,
                stream:   false,
                options: {
                    temperature: 0.3,   // Low temp = more factual, less hallucination
                    num_predict: 300,   // Max tokens in response — keep it brief
                    top_p: 0.9
                }
            })
        });

        if (!ollamaRes.ok) {
            const errText = await ollamaRes.text();
            console.error("[Chatbot] Ollama error:", errText);
            return res.status(502).json({
                success: false,
                message: "AI model is not available right now. Please try again in a moment.",
                detail: errText
            });
        }

        const data = await ollamaRes.json();
        const reply = data?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

        res.status(200).json({ success: true, reply: reply.trim() });

    } catch (error) {
        console.error("[Chatbot] Error:", error.message);

        // User-friendly error when Ollama isn't running
        const isConnectionErr = error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED");
        res.status(502).json({
            success: false,
            message: isConnectionErr
                ? "The AI assistant is offline. Please ensure Ollama is running locally."
                : "An unexpected error occurred. Please try again.",
            error: error.message
        });
    }
};
