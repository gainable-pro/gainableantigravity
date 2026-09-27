const fs = require('fs');

const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));
const experts = JSON.parse(fs.readFileSync('experts.json', 'utf8'));

console.log('--- EXPERTS CREATED ON 2026-01-19 ---');
experts.forEach(exp => {
  console.log(`\n========================================`);
  console.log(`Expert: ${exp.nom_entreprise} (${exp.slug})`);
  console.log(`Created at: ${exp.created_at}`);
  console.log(`Logo URL: ${exp.logo_url}`);
});
