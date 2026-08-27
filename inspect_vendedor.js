const fs = require('fs');
const html = fs.readFileSync('paginas_web/vendedor.html', 'utf8');

// Print every img tag in vendedor.html
const imgs = [...html.matchAll(/<img[^>]+>/gi)].map(m => m[0]);
console.log('=== IMAGES IN vendedor.html ===');
imgs.forEach((img, i) => {
  console.log(`\n[${i+1}] ${img}`);
});

// Print video tags
const vids = [...html.matchAll(/<video[\s\S]*?<\/video>/gi)].map(m => m[0]);
console.log('\n=== VIDEOS IN vendedor.html ===');
vids.forEach((v, i) => {
  console.log(`\n[${i+1}] ${v}`);
});
