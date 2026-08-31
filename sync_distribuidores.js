const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'Pagina Web Distribuidores', 'distribuidores-app', 'out');
const targetDir = path.join(__dirname, 'distribuidores');
const rootDir = __dirname;

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

console.log('1. Sincronizando /distribuidores...');
copyFolderSync(outDir, targetDir);

console.log('2. Sincronizando archivos JSON y logo a la raíz...');
const publicFiles = ['colombia_municipios.json', 'colombia.json', 'logo.png'];
publicFiles.forEach(f => {
  const src = path.join(outDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(rootDir, f));
    console.log(`=> Copiado a raíz: ${f}`);
  }
});

console.log('3. Creando ruta independiente para la Landing Page (/oferta)...');
const ofertaRoot = path.join(rootDir, 'oferta');
if (!fs.existsSync(ofertaRoot)) fs.mkdirSync(ofertaRoot, { recursive: true });
const ofertaSrc = path.join(outDir, 'oferta', 'index.html');
if (fs.existsSync(ofertaSrc)) {
  fs.copyFileSync(ofertaSrc, path.join(ofertaRoot, 'index.html'));
  console.log('=> Landing page copiada a /oferta');
}

console.log('4. Creando ruta independiente para la Landing Page V2 (/oferta-v2)...');
const ofertaV2Root = path.join(rootDir, 'oferta-v2');
if (!fs.existsSync(ofertaV2Root)) fs.mkdirSync(ofertaV2Root, { recursive: true });
const ofertaV2Src = path.join(outDir, 'oferta-v2', 'index.html');
if (fs.existsSync(ofertaV2Src)) {
  fs.copyFileSync(ofertaV2Src, path.join(ofertaV2Root, 'index.html'));
  console.log('=> Landing page V2 copiada a /oferta-v2');
}

console.log('¡Sincronización completada!');
