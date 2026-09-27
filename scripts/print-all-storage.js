const fs = require('fs');

const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));
const experts = JSON.parse(fs.readFileSync('experts.json', 'utf8'));

console.log('--- ALL STORAGE FILES ---');
files.forEach((f, idx) => {
  console.log(`${idx + 1}. ${f.name} | Created: ${f.created_at}`);
});
