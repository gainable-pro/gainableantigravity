
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../prisma/migrations/20240101000000_init/migration.sql');

try {
    // Read buffer
    const buffer = fs.readFileSync(filePath);

    // Detect if we have BOM or UTF-16
    // Simple approach: Convert to string and write back as UTF-8
    const content = buffer.toString();

    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
    console.log('Converted to UTF-8:', filePath);
} catch (e) {
    console.error('Error:', e);
}
