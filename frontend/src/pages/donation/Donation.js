import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Donation = () => {
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        axios.post("http://localhost:8080/api/create-payment-intent", {
            amount: 1000 // Amount in cents (e.g., $10)
        }).then((res) => {
            setClientSecret(res.data.clientSecret);
        }).catch((err) => {
            console.error("Error creating payment intent:", err);
        });
    }, []);

    return (
        <button 
            className='bg-pink-600 py-1 px-4 rounded-full text-white mt-4'
            onClick={() => navigate("/checkOut", { state: { clientSecret } })}
            disabled={!clientSecret} // Disable if not loaded
        >
            Donate Now
        </button>
    );
};

export default Donation;
