import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckoutForm = ({ orderData, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment success! Now create the order in the backend
            onSuccess(paymentIntent.id);
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <div className="flex gap-4 mt-6">
                <button 
                    disabled={isLoading || !stripe || !elements} 
                    id="submit"
                    className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    <span id="button-text">
                        {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div> : "Pay Now"}
                    </span>
                </button>
                <button 
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
            {message && <div id="payment-message" className="text-red-500 text-sm mt-4 font-medium px-4 py-2 bg-red-50 rounded-lg">{message}</div>}
        </form>
    );
};

export default StripeCheckoutForm;
