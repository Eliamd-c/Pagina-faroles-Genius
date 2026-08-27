const fs = require('fs');
const path = require('path');

const paginasDir = path.join(__dirname, 'paginas_web');
const files = fs.readdirSync(paginasDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(paginasDir, f), 'utf8');
  if (content.includes('.mp4') || content.includes('video')) {
    console.log(`\n=== File: ${f} ===`);
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('.mp4') || line.includes('<video')) {
        console.log(`Line ${idx + 1}: ${line.trim().slice(0, 200)}`);
      }
    });
  }
});
