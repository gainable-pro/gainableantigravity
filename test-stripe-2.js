const fs = require('fs');
const stripeLib = require('stripe');

const envContent = fs.readFileSync('.env', 'utf16le');
const stripeKeyMatch = envContent.match(/STRIPE_SECRET_KEY=(sk_test_[a-zA-Z0-9]+)/);

if (!stripeKeyMatch) {
  console.log('No STRIPE_SECRET_KEY found');
  process.exit(1);
}

const stripe = stripeLib(stripeKeyMatch[1]);

async function test() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1T8hJqGfw444kXxvrjmaGSFL', // fallback code value
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
  }
}

test();
