const fs = require('fs');
const path = require('path');

const paginasDir = path.join(__dirname, 'paginas_web');
const files = ['inicio.html', 'vendedor.html', 'pagina-al-detal.html'];

for (const file of files) {
  const content = fs.readFileSync(path.join(paginasDir, file), 'utf8');
  console.log(`\n=================== ${file} ===================`);
  
  // 1. Check img tags
  const imgMatches = [...content.matchAll(/<img[^>]+>/gi)].map(m => m[0]);
  console.log(`Total <img> tags: ${imgMatches.length}`);
  imgMatches.slice(0, 5).forEach((img, idx) => {
    console.log(`Img #${idx + 1}: ${img.slice(0, 150)}...`);
  });

  // 2. Check video tags
  const videoMatches = [...content.matchAll(/<video[^>]*>[\s\S]*?<\/video>/gi)].map(m => m[0]);
  console.log(`Total <video> tags: ${videoMatches.length}`);
  videoMatches.slice(0, 3).forEach((vid, idx) => {
    console.log(`Video #${idx + 1}: ${vid.slice(0, 200)}...`);
  });

  // 3. Check background-image / style URLs
  const bgMatches = [...content.matchAll(/url\([^)]+\)/gi)].map(m => m[0]);
  console.log(`Total CSS url(...) matches: ${bgMatches.length}`);
  bgMatches.slice(0, 5).forEach((bg, idx) => {
    console.log(`Background #${idx + 1}: ${bg}`);
  });
}
