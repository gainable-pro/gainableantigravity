const fs = require('fs');
const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));
const experts = JSON.parse(fs.readFileSync('experts.json', 'utf8'));

console.log('--- Expert Logo URLs vs Storage Files ---');

experts.forEach(exp => {
  console.log(`\n========================================`);
  console.log(`EXPERT: ${exp.nom_entreprise} (${exp.slug})`);
  console.log(`Logo URL: ${exp.logo_url}`);
  
  // Extract timestamp or filename from logo_url if present
  let logoFilename = exp.logo_url ? exp.logo_url.split('/').pop() : '';
  let timePrefix = '';
  const timeMatch = logoFilename.match(/^(17\d{8,10})/);
  if (timeMatch) {
    timePrefix = timeMatch[1];
  }

  // Find files matching timePrefix or company name tokens
  const nameTokens = exp.nom_entreprise.toLowerCase().replace(/[\(\)]/g, '').split(/[\s\-_]+/);
  
  const matchedFiles = files.filter(f => {
    const fName = f.name.toLowerCase();
    // match by time prefix (first 10 digits)
    if (timePrefix && fName.startsWith(timePrefix)) return true;
    // match by explicit logo filename
    if (logoFilename && fName.includes(logoFilename)) return true;
    // match company specific unique keywords
    if (exp.slug.includes('air-g-energie') && (fName.includes('airg') || fName.includes('1765405') || fName.includes('1765604') || fName.includes('1767334'))) return true;
    if (exp.slug.includes('lorraine-chauffage') && fName.includes('lorraine')) return true;
    if (exp.slug.includes('eco-solutions') && fName.includes('eco-solutions')) return true;
    if (exp.slug.includes('aery') && fName.includes('aery')) return true;
    if (exp.slug.includes('profeclim') && fName.includes('profeclim')) return true;
    if (exp.slug.includes('patinet') && fName.includes('patinet')) return true;
    if (exp.slug.includes('smb-13') && fName.includes('smb13')) return true;
    if (exp.slug.includes('fexim') && fName.includes('fexim')) return true;
    if (exp.slug.includes('excelec') && fName.includes('excelec')) return true;
    if (exp.slug.includes('experia') && fName.includes('experia')) return true;
    if (exp.slug.includes('plomberie-services-91') && (fName.includes('plomberie') || fName.includes('services-91'))) return true;
    return false;
  });

  console.log(`Matched Files (${matchedFiles.length}):`);
  matchedFiles.forEach(f => console.log(`  - ${f.name}`));
});
