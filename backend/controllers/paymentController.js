const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body; // Amount should be in the smallest currency unit (e.g., cents for USD)

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Example: 1000 means $10.00
            currency,
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret, // This is sent to the frontend
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ success: false, message: "Payment error" });
    }
};

module.exports = { createPaymentIntent };
