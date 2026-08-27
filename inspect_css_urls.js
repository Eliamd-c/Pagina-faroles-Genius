const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'paginas_web', 'wp-content', 'uploads', 'elementor', 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  console.log('CSS files in elementor/css:', cssFiles.length);

  cssFiles.forEach(f => {
    const code = fs.readFileSync(path.join(cssDir, f), 'utf8');
    const urls = [...code.matchAll(/url\(([^)]+)\)/gi)].map(m => m[1]);
    if (urls.length > 0) {
      console.log(`\nFile ${f} has ${urls.length} URLs:`, urls.slice(0, 5));
    }
  });
}
