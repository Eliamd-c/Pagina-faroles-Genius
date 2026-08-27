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
    console.log(`✓ Copiado a raíz: ${f}`);
  }
});

console.log('¡Sincronización de mapas y logos completada!');
