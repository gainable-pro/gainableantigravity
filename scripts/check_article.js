const https = require('https');

https.get('https://www.gainable.fr/entreprise/climatisation-pompe-a-chaleur-miramas-air-g-energie-8907/articles/installation-climatisation-gainable-12kw-septemes-les-vallons', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Contains id="devis":', data.includes('id="devis"'));
    console.log('Contains "Estimation Gratuite":', data.includes('Estimation Gratuite'));
    console.log('Contains "Demander mes devis gratuits":', data.includes('Demander mes devis gratuits'));
    console.log('Contains "devis":', data.includes('devis'));
  });
}).on('error', err => console.error(err));
