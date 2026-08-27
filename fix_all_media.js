const fs = require('fs');
const path = require('path');

const paginasDir = path.join(__dirname, 'paginas_web');
const rootDir = __dirname;

// 1. Corregir rutas en todos los archivos CSS
function fixCssFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      fixCssFiles(full);
    } else if (f.endsWith('.css')) {
      let css = fs.readFileSync(full, 'utf8');

      // Si está en wp-content/uploads/elementor/css/
      // La ruta correcta para ir a wp-content/uploads/2024/... desde elementor/css/ es ../../2024/...
      // O ruta absoluta /paginas_web/wp-content/ o /wp-content/
      const fromDir = path.dirname(full);
      const toWpContent = path.relative(fromDir, path.join(paginasDir, 'wp-content')).replace(/\\/g, '/');
      const toUploads = path.relative(fromDir, path.join(paginasDir, 'wp-content', 'uploads')).replace(/\\/g, '/');

      // Reemplazar rutas erróneas como ../../../uploads/ o ../../wp-content/uploads
      css = css.replace(/\.\.\/\.\.\/\.\.\/uploads\//g, `${toUploads}/`);
      css = css.replace(/wp-content\/wp-content\//g, 'wp-content/');

      // Reemplazar cualquier https://farolesgenius.com/wp-content/
      css = css.replace(/https:\/\/farolesgenius\.com\/wp-content\/uploads\//g, `${toUploads}/`);
      css = css.replace(/https:\/\/farolesgenius\.com\/wp-content\//g, `${toWpContent}/`);

      fs.writeFileSync(full, css, 'utf8');
    }
  }
}

fixCssFiles(path.join(paginasDir, 'wp-content'));
console.log('✓ Archivos CSS corregidos.');

// 2. Corregir archivos HTML (reemplazar placeholders, data-src, lazy load y video sources)
const htmlFiles = fs.readdirSync(paginasDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const full = path.join(paginasDir, file);
  let html = fs.readFileSync(full, 'utf8');

  // Corregir base64 roto "image/png;base64," -> "data:image/png;base64," si existe
  html = html.replace(/src=["']image\/png;base64,/g, 'src="data:image/png;base64,');

  // Corregir duplicados de wp-content/wp-content
  html = html.replace(/wp-content\/wp-content\//g, 'wp-content/');
  html = html.replace(/paginas_web\/paginas_web\//g, 'paginas_web/');

  // Inyectar fuente para videos de Elementor background video si está vacío
  if (file === 'inicio.html') {
    html = html.replace(
      /<video class="elementor-background-video-hosted" role="presentation" autoplay muted playsinline loop><\/video>/g,
      '<video class="elementor-background-video-hosted" role="presentation" autoplay muted playsinline loop style="width:100%;height:100%;object-fit:cover;"><source src="wp-content/uploads/2025/09/DJI_20240725210939_0218_D-1.mp4" type="video/mp4"></video>'
    );
  }

  // Asegurar que las imágenes con srcset usen rutas relativas limpias
  html = html.replace(/https:\/\/farolesgenius\.com\/wp-content\//g, 'wp-content/');
  html = html.replace(/https:\/\/farolesgenius\.com\/wp-includes\//g, 'wp-includes/');

  fs.writeFileSync(full, html, 'utf8');
  console.log(`✓ HTML actualizado: ${file}`);
});

// 3. Copiar wp-content y wp-includes a la raíz también para máxima compatibilidad con cualquier servidor
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      if (!fs.existsSync(toPath)) {
        fs.copyFileSync(fromPath, toPath);
      }
    }
  });
}

console.log('Sincronizando carpetas de medios en la raíz...');
copyFolderSync(path.join(paginasDir, 'wp-content'), path.join(rootDir, 'wp-content'));
copyFolderSync(path.join(paginasDir, 'wp-includes'), path.join(rootDir, 'wp-includes'));

console.log('¡Sincronización y corrección completa finalizada con éxito!');
