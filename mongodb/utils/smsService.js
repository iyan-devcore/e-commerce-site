import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Normalises a phone number to E.164 format.
 * Assumes Indian (+91) numbers if no country code is provided.
 */
const normalisePhone = (phone) => {
    let num = phone.trim().replace(/\s+/g, "");
    if (num.startsWith("+")) return num;           // already has country code
    if (num.startsWith("0")) num = num.slice(1);   // strip leading 0
    return "+91" + num;                            // default to India
};

/**
 * Sends a professional order confirmation SMS via Twilio.
 * @param {string} toPhone   - Customer phone number from checkout form
 * @param {object} orderInfo - { customerName, orderId, total, itemCount }
 */
export const sendOrderConfirmationSMS = async (toPhone, orderInfo) => {
    if (!accountSid || !authToken || !fromNumber) {
        console.warn("[SMS] Twilio credentials not set in .env – skipping SMS.");
        return;
    }

    const phone = normalisePhone(toPhone);
    const { customerName, orderId, total, itemCount } = orderInfo;
    const shortId = String(orderId).slice(-8).toUpperCase();

    const message =
        `Hello ${customerName},\n\n` +
        `Thank you for your purchase at TechStore!\n\n` +
        `Order ID : #${shortId}\n` +
        `Items    : ${itemCount}\n` +
        `Total    : Rs.${Number(total).toFixed(2)}\n\n` +
        `Your order is confirmed and being processed. It will be shipped to you shortly.\n\n` +
        `For support, contact us at support@techstore.com\n\n` +
        `- TechStore Team`;

    try {
        const client = twilio(accountSid, authToken);
        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: phone
        });
        console.log(`[SMS] Order confirmation sent to ${phone} | SID: ${result.sid}`);
    } catch (err) {
        // Non-fatal — order still succeeds even if SMS fails
        console.error(`[SMS] Failed to send SMS to ${phone}:`, err.message);
    }
};
