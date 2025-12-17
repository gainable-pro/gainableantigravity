import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2024-11-20.acacia', // Use latest API version or pin to a specific one
    typescript: true,
});
