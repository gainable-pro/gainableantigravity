const fs = require('fs');
const path = require('path');

function getStripeKey() {
  const files = ['.env.local', '.env'];
  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      // Try reading with utf16le first, then utf8
      let content = '';
      try {
        content = fs.readFileSync(filePath, 'utf16le');
      } catch (e) {
        content = fs.readFileSync(filePath, 'utf8');
      }
      if (!content.includes('STRIPE_SECRET_KEY=')) {
        try {
          content = fs.readFileSync(filePath, 'utf8');
        } catch (e) {}
      }

      const match = content.match(/STRIPE_SECRET_KEY=([^\r\n]+)/);
      if (match) {
        console.log(`Found STRIPE_SECRET_KEY in ${file}`);
        return match[1].trim().replace(/['"]/g, '');
      }
    }
  }
  return null;
}

const secretKey = getStripeKey();
if (!secretKey) {
  console.log('No STRIPE_SECRET_KEY found in any env file.');
  process.exit(1);
}

const stripe = require('stripe')(secretKey);

async function checkProducts() {
  const products = {
    CVC: 'prod_UhKN02uvUnWKyW',
    Diag: 'prod_UhKQSlrUKFnyjP'
  };

  for (const [name, productId] of Object.entries(products)) {
    console.log(`\n--- Prices for ${name} (Product ID: ${productId}) ---`);
    try {
      const prices = await stripe.prices.list({
        product: productId,
        active: true
      });
      if (prices.data.length === 0) {
        console.log('No active prices found.');
      } else {
        prices.data.forEach(price => {
          console.log(`Price ID: ${price.id}`);
          console.log(`  Amount: ${price.unit_amount / 100} ${price.currency.toUpperCase()}`);
          console.log(`  Interval: ${price.recurring ? price.recurring.interval : 'one-time'}`);
          console.log(`  Nickname: ${price.nickname || 'None'}`);
        });
      }
    } catch (err) {
      console.error(`Error fetching prices for ${name}:`, err.message);
    }
  }
}

checkProducts();
