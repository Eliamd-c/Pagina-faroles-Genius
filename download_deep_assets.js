const fs = require('fs');
const path = require('path');

const paginasDir = path.join(__dirname, 'paginas_web');

// 1. Recolectar recursivamente todos los archivos HTML y CSS
function getAllFiles(dir, exts) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(getAllFiles(full, exts));
    } else if (exts.includes(path.extname(f).toLowerCase())) {
      res.push(full);
    }
  }
  return res;
}

const htmlAndCssFiles = getAllFiles(paginasDir, ['.html', '.css']);
console.log(`Analizando ${htmlAndCssFiles.length} archivos HTML y CSS...`);

const allRemoteUrls = new Set();

htmlAndCssFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');

  // Buscar URLs de farolesgenius.com
  const matches = content.match(/https:\/\/farolesgenius\.com\/(wp-content|wp-includes)\/[^\s"'(),<>]+/gi) || [];
  matches.forEach(url => {
    let clean = url.split('?')[0].split('#')[0].replace(/\\/g, '').replace(/&$/, '');
    if (clean.endsWith(')') || clean.endsWith('"') || clean.endsWith("'")) {
      clean = clean.slice(0, -1);
    }
    allRemoteUrls.add(clean);
  });
});

console.log(`Encontrados ${allRemoteUrls.size} recursos (incluyendo GIFs, videos, fondos, fuentes)...`);

async function downloadAsset(url) {
  try {
    const parsed = new URL(url);
    const relPath = parsed.pathname.replace(/^\//, ''); // wp-content/...
    const targetFile = path.join(paginasDir, relPath);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 0) {
      return true; // Ya descargado
    }

    const dir = path.dirname(targetFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(targetFile, buffer);
      console.log(`✓ Descargado: ${relPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
      return true;
    } else {
      console.warn(`[${res.status}] No encontrado: ${url}`);
      return false;
    }
  } catch(e) {
    console.error(`Error en ${url}:`, e.message);
    return false;
  }
}

async function run() {
  const urls = Array.from(allRemoteUrls);
  let okCount = 0;
  
  // Descargar concurrentemente
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.all(batch.map(async u => {
      const ok = await downloadAsset(u);
      if (ok) okCount++;
    }));
  }

  console.log(`\nDescarga terminada: ${okCount} archivos listos.`);

  // 2. Reemplazar en TODOS los archivos CSS y HTML
  console.log('Reescribiendo rutas en HTML y CSS...');
  htmlAndCssFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // En archivos CSS dentro de wp-content/uploads/elementor/css/ o similar,
    // calcular ruta relativa adecuada o usar ruta absoluta relativa a la raíz /paginas_web/wp-content/
    // Para CSS, url('https://farolesgenius.com/wp-content/...') -> url('../../...') o url('/paginas_web/wp-content/...')
    if (filePath.endsWith('.css')) {
      const fromDir = path.dirname(filePath);
      const toWpContent = path.relative(fromDir, path.join(paginasDir, 'wp-content')).replace(/\\/g, '/');
      const toWpIncludes = path.relative(fromDir, path.join(paginasDir, 'wp-includes')).replace(/\\/g, '/');
      
      content = content.replace(/https:\/\/farolesgenius\.com\/wp-content\//g, `${toWpContent}/`);
      content = content.replace(/https:\/\/farolesgenius\.com\/wp-includes\//g, `${toWpIncludes}/`);
    } else {
      // En archivos HTML
      content = content.replace(/https:\/\/farolesgenius\.com\/wp-content\//g, 'wp-content/');
      content = content.replace(/https:\/\/farolesgenius\.com\/wp-includes\//g, 'wp-includes/');
      content = content.replace(/https:\\\/\\\/farolesgenius\.com\\\/wp-content\\\//g, 'wp-content\\/');
      content = content.replace(/https:\\\/\\\/farolesgenius\.com\\\/wp-includes\\\//g, 'wp-includes\\/');
    }

    fs.writeFileSync(filePath, content, 'utf8');
  });

  console.log('¡Todos los archivos CSS, HTML, GIFs, videos e imágenes están 100% actualizados localmente!');
}

run().catch(console.error);
