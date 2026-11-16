const fs = require('fs');
const https = require('https');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
let token = '';
envContent.split('\n').forEach(line => {
  const m = line.match(/^\s*VERCEL_TOKEN\s*=\s*\"?(.*?)\"?\s*$/);
  if (m) token = m[1].replace(/["\r]/g, '');
});

const projectId = 'prj_SLsBEKr6iQmAxGvMbEnIx75T4M75';
const teamId = 'team_xiUTJKlqxzlAfX8gT6d5EFeu';

https.get({
  hostname: 'api.vercel.com',
  path: `/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=5`,
  headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'Node.js' }
}, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    const list = JSON.parse(d).deployments;
    list.forEach(dep => {
      console.log(`[${dep.state}] ${dep.uid} - ${dep.meta?.githubCommitMessage?.split('\n')[0]}`);
    });
    const failed = list.find(x => x.state === 'ERROR');
    if (!failed) return console.log('No failed deployment found');
    console.log('\n--- Inspecting failed:', failed.uid, '---');
    https.get({
      hostname: 'api.vercel.com',
      path: `/v2/deployments/${failed.uid}/events?teamId=${teamId}`,
      headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'Node.js' }
    }, r2 => {
      let d2 = ''; r2.on('data', c => d2 += c); r2.on('end', () => {
        let events;
        try { events = JSON.parse(d2); } catch(e) { console.error('Parse error:', d2); return; }
        if (!Array.isArray(events)) {
          console.log('Events response is not array:', events);
          return;
        }
        console.log('Total events:', events.length);
        console.log('--- ALL LAST 40 LOG EVENTS ---');
        events.slice(-40).forEach(e => {
          if (e.payload?.text) console.log(e.payload.text);
        });
      });
    });
  });
});
