const fs = require('fs');
const path = require('path');

const paginasDir = path.join(__dirname, 'paginas_web');
const htmlFiles = fs.readdirSync(paginasDir).filter(f => f.endsWith('.html') && f !== 'index.html');

const videosToDownload = new Set();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(paginasDir, file), 'utf8');
  console.log(`\n=== Scanning ${file} ===`);

  // Find all video links in data-settings or attributes
  const matches = content.match(/background_video_link[^,}"']+/g) || [];
  matches.forEach(m => console.log('Found video setting in ' + file + ':', m));

  const allMp4 = content.match(/https?:\/\/[^\s"'<>]+\.mp4/gi) || [];
  allMp4.forEach(v => videosToDownload.add(v.replace(/\\/g, '')));

  const relMp4 = content.match(/wp-content\/uploads\/[^\s"'<>]+\.mp4/gi) || [];
  relMp4.forEach(v => videosToDownload.add('https://farolesgenius.com/' + v.replace(/\\/g, '')));
});

console.log('\n=== Videos detected across all pages ===');
console.log(Array.from(videosToDownload));
