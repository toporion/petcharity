import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Route';
import AuthProvider from './authProvider/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51R8Qs3PvV973QacrdOi2KjkmIEQp5ZPmaL9rnbGpl4BpWwrOlaDXutiyF9fbN9x3nz7MnqcVAhWZLLrVnHD2HNCi000od3lb2Q");

// Create a Query Client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
        </Elements>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
