const fs = require('fs');
const path = require('path');

function updateNextConfig() {
  const fileContent = fs.readFileSync(path.join(__dirname, '../Tableau_404.csv'), 'utf-8');
  const lines = fileContent.split('\n').map(l => l.trim()).filter(Boolean);
  
  const redirects = [];
  
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (!parts[0]) continue;
    
    let rawUrl = parts[0].trim();
    try {
      const parsed = new URL(rawUrl);
      let pathname = parsed.pathname;
      
      if (!pathname || pathname === '/') continue;

      let destination = '/';

      if (pathname.startsWith('/installation-climatisation-')) {
        const city = pathname.replace('/installation-climatisation-', '');
        destination = `/climatisation/${city}`;
      } else if (pathname.startsWith('/climatisation-') && !pathname.startsWith('/climatisation/')) {
        const city = pathname.replace('/climatisation-', '');
        destination = `/climatisation/${city}`;
      } else if (pathname.startsWith('/trouver-installateur/')) {
        const city = pathname.replace('/trouver-installateur/', '');
        destination = `/climatisation/${city}`;
      } else if (pathname.startsWith('/post/')) {
        destination = '/articles';
      } else if (pathname.startsWith('/blog/')) {
        destination = '/articles';
      } else if (pathname.startsWith('/hotellerie-restauration')) {
        destination = '/climatisation';
      } else if (pathname.startsWith('/pro/')) {
        destination = '/repertoire';
      } else if (pathname.startsWith('/entreprise/')) {
        destination = '/repertoire';
      } else {
        destination = '/climatisation';
      }

      redirects.push({ source: pathname, destination, permanent: true });
    } catch (e) {}
  }

  // Deduplicate
  const uniqueMap = new Map();
  redirects.forEach(r => {
    if (!uniqueMap.has(r.source)) {
      uniqueMap.set(r.source, r);
    }
  });
  const cleanRedirects = Array.from(uniqueMap.values());

  const configPath = path.join(__dirname, '../next.config.ts');
  let configContent = fs.readFileSync(configPath, 'utf-8');

  // Insert redirects inside async redirects() { return [ ... ]; }
  const redirectsCode = cleanRedirects.map(r => `      { source: '${r.source}', destination: '${r.destination}', permanent: true },`).join('\n');

  configContent = configContent.replace(
    /async redirects\(\) \{\s*return \[([\s\S]*?)\];\s*\}/,
    (match, existing) => {
      return `async redirects() {\n    return [\n${existing.trim()}\n${redirectsCode}\n    ];\n  }`;
    }
  );

  fs.writeFileSync(configPath, configContent);
  console.log(`✅ Successfully added ${cleanRedirects.length} redirects to next.config.ts!`);
}

updateNextConfig();
