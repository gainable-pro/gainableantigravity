const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('uploadsDir does not exist');
  process.exit(0);
}

const files = fs.readdirSync(uploadsDir);
console.log(`Found ${files.length} files in public/uploads/:\n`);
files.forEach((f, idx) => {
  console.log(`${idx + 1}. ${f}`);
});
