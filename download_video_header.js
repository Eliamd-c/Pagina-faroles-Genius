const fs = require('fs');
const path = require('path');

async function testDownloadVideo() {
  const url = 'https://farolesgenius.com/wp-content/uploads/2024/07/Video-1080.mp4';
  const dest = path.join(__dirname, 'paginas_web', 'wp-content', 'uploads', '2024', '07', 'Video-1080.mp4');

  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log('Descargando Video-1080.mp4...');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  if (res.ok) {
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`✓ Video-1080.mp4 guardado (${(buffer.length / (1024*1024)).toFixed(2)} MB)`);
  }
}
testDownloadVideo();
