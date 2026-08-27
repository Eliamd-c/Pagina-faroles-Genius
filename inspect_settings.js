const fs = require('fs');
const html = fs.readFileSync('paginas_web/inicio.html', 'utf8');

// Find all data-settings with video or media links
const settingsMatches = [...html.matchAll(/data-settings=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Total data-settings attributes:', settingsMatches.length);

settingsMatches.forEach((s, idx) => {
  const decoded = s.replace(/&quot;/g, '"');
  if (decoded.includes('video') || decoded.includes('mp4') || decoded.includes('gif') || decoded.includes('jpg') || decoded.includes('png')) {
    console.log(`\n[${idx + 1}] Media setting:`, decoded);
  }
});
