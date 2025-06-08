const parser = require('./parser');
const fs = require('fs');
const path = require('path');
const outPath = path.join(__dirname, '..', 'public', 'data.json');
const data = parser.getData();
fs.writeFileSync(outPath, JSON.stringify(data));
console.log('Wrote', Object.keys(data).length, 'items to', outPath);
