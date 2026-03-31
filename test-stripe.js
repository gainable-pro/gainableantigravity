const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function main() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_CVC || 'price_1T8hJqGfw444kXxvrjmaGSFL',
          quantity: 1,
        },
      ],
      customer_email: 'test@example.com',
      metadata: { expertId: 'test' },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      success_url: `https://example.com/success`,
      cancel_url: `https://example.com/cancel`,
    });
    console.log("Success! Session URL:", session.url);
  } catch (err) {
    console.error("Stripe Error Details:");
    console.error(err.message);
    if (err.raw) {
      console.error(err.raw.message);
    }
  }
}

main();
