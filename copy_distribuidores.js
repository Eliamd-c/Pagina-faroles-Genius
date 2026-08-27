const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'Pagina Web Distribuidores', 'distribuidores-app', 'out');
const targetDir = path.join(__dirname, 'distribuidores');

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

console.log('Copiando build estático a /distribuidores...');
copyFolderSync(outDir, targetDir);
console.log('✓ /distribuidores generado exitosamente.');
