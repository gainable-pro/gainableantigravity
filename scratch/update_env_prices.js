const fs = require('fs');
const path = require('path');

const newPrices = {
  STRIPE_PRICE_CVC: 'price_1ThviWGfw444kXxvdJrfcGwj',
  STRIPE_PRICE_CVC_MONTHLY: 'price_1ThvjKGfw444kXxvQ8ypVgxa',
  STRIPE_PRICE_DIAG: 'price_1ThvldGfw444kXxv8MArvpef',
  STRIPE_PRICE_DIAG_MONTHLY: 'price_1ThvmEGfw444kXxvPDCsSip1',
};

function updateEnvFile(filename) {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`${filename} does not exist.`);
    return;
  }

  let content = '';
  let encoding = 'utf8';
  
  // Detect encoding (utf16le vs utf8)
  try {
    const raw = fs.readFileSync(filePath);
    // If it starts with BOM for UTF-16LE or has null bytes, treat as UTF-16LE
    if (raw[0] === 0xff && raw[1] === 0xfe || raw.includes(0x00)) {
      encoding = 'utf16le';
    }
    content = raw.toString(encoding);
  } catch (e) {
    console.error(`Failed to read ${filename}:`, e.message);
    return;
  }

  let lines = content.split(/\r?\n/);
  const updatedKeys = new Set();

  lines = lines.map(line => {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (match) {
      const key = match[1];
      if (newPrices[key]) {
        updatedKeys.add(key);
        return `${key}="${newPrices[key]}"`;
      }
    }
    return line;
  });

  // Add keys that were not present in the file
  for (const [key, value] of Object.entries(newPrices)) {
    if (!updatedKeys.has(key)) {
      console.log(`Adding missing key ${key} to ${filename}`);
      // Find where to append or insert. We'll append before the last empty line if possible
      if (lines.length > 0 && lines[lines.length - 1] === '') {
        lines.splice(lines.length - 1, 0, `${key}="${value}"`);
      } else {
        lines.push(`${key}="${value}"`);
      }
    } else {
      console.log(`Updating key ${key} in ${filename}`);
    }
  }

  const newContent = lines.join('\n');
  try {
    fs.writeFileSync(filePath, Buffer.from(newContent, encoding));
    console.log(`Successfully updated ${filename}`);
  } catch (e) {
    console.error(`Failed to write ${filename}:`, e.message);
  }
}

updateEnvFile('.env');
updateEnvFile('.env.local');
