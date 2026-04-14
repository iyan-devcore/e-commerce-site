import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// Use process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const StripeContainer = ({ clientSecret, orderData, onSuccess, onCancel }) => {
    if (!clientSecret) return null;

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#2563eb', // Matches your blue-600
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#df1b41',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '12px',
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Your Payment</h3>
            <Elements stripe={stripePromise} options={options}>
                <StripeCheckoutForm 
                    orderData={orderData} 
                    onSuccess={onSuccess} 
                    onCancel={onCancel}
                />
            </Elements>
        </div>
    );
};

export default StripeContainer;
