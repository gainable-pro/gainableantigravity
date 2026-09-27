const fs = require('fs');

const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));

// Sort files by timestamp
const sorted = files.map(f => {
  let ts = 0;
  const match = f.name.match(/^(17\d+)/);
  if (match) ts = parseInt(match[1]);
  else if (f.created_at) ts = new Date(f.created_at).getTime();
  return { ...f, ts };
}).sort((a, b) => a.ts - b.ts);

console.log(`Sorted ${sorted.length} files chronologically...`);

let currentGroup = [];
let lastTs = 0;

sorted.forEach(f => {
  // If timestamp gap is less than 30 minutes (1800000 ms), group together
  if (f.ts - lastTs > 1800000 && currentGroup.length > 0) {
    console.log(`\n========================================`);
    console.log(`SESSION BATCH (Start: ${new Date(currentGroup[0].ts).toISOString()}, Count: ${currentGroup.length})`);
    currentGroup.forEach(item => {
      console.log(`  - ${item.name}`);
    });
    currentGroup = [];
  }
  currentGroup.push(f);
  lastTs = f.ts;
});

if (currentGroup.length > 0) {
  console.log(`\n========================================`);
  console.log(`SESSION BATCH (Start: ${new Date(currentGroup[0].ts).toISOString()}, Count: ${currentGroup.length})`);
  currentGroup.forEach(item => {
    console.log(`  - ${item.name}`);
  });
}
