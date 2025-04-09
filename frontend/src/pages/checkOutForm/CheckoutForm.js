import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const clientSecret = location.state?.clientSecret;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!stripe || !elements || !clientSecret) {
            setMessage("Payment information is missing.");
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            setMessage(error.message);
        } else if (paymentIntent.status === "succeeded") {
            setMessage("Payment successful!");

            // Save donation on backend
            try {
                await axios.post("http://localhost:8080/api/confirm-payment", {
                    paymentIntentId: paymentIntent.id,
                    amount: 5000, // Hardcoded for now, make dynamic later
                });
            } catch (err) {
                setMessage("Error saving donation.");
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default CheckoutForm;
