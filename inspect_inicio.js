const fs = require('fs');
const html = fs.readFileSync('paginas_web/inicio.html', 'utf8');

// Print every img tag in inicio.html
const imgs = [...html.matchAll(/<img[^>]+>/gi)].map(m => m[0]);
console.log('=== IMAGES IN inicio.html (' + imgs.length + ') ===');
imgs.forEach((img, i) => {
  console.log(`\n[${i+1}] ${img.slice(0, 250)}`);
});

// Print video / iframe tags in inicio.html
const vids = [...html.matchAll(/<(video|iframe)[\s\S]*?<\/(video|iframe)>/gi)].map(m => m[0]);
console.log('\n=== VIDEOS / IFRAMES IN inicio.html (' + vids.length + ') ===');
vids.forEach((v, i) => {
  console.log(`\n[${i+1}] ${v.slice(0, 250)}`);
});
