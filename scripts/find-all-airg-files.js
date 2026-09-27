const fs = require('fs');
const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));

console.log('Searching all files for Air G Energie...');

files.forEach(f => {
  const name = f.name.toLowerCase();
  if (
    name.includes('airg') ||
    name.includes('1765405') ||
    name.includes('1765437') ||
    name.includes('1765604') ||
    name.includes('1765605') ||
    name.includes('1767334') ||
    name.includes('1768123')
  ) {
    console.log(`- ${f.name} (created: ${f.created_at})`);
  }
});
