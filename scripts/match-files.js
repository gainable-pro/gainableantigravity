const fs = require('fs');

const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));
const experts = JSON.parse(fs.readFileSync('experts.json', 'utf8'));

console.log(`Analyzing ${files.length} storage files against ${experts.length} experts...`);

files.forEach(f => {
  const name = f.name.toLowerCase();
  let matchedExpert = null;
  for (const exp of experts) {
    const companyTokens = exp.nom_entreprise.toLowerCase().split(/[\s\-_()]+/);
    // Check if filename contains major tokens of company name
    const matches = companyTokens.filter(t => t.length > 3 && name.includes(t));
    if (matches.length > 0) {
      matchedExpert = exp.nom_entreprise;
      break;
    }
  }
  console.log(`${f.name} -> ${matchedExpert || 'UNMATCHED'}`);
});
