const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'paginas_web', 'wp-content', 'uploads', 'elementor', 'css', 'post-643.css');
if (fs.existsSync(cssPath)) {
  const code = fs.readFileSync(cssPath, 'utf8');
  const urls = [...code.matchAll(/url\(([^)]+)\)/gi)].map(m => m[1]);
  console.log('URLs inside post-643.css:', urls);
}
