const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5051;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let decodedUrl = decodeURI(req.url.split('?')[0]);
  
  if (decodedUrl === '/') {
    decodedUrl = '/index.html';
  } else if (decodedUrl.endsWith('/')) {
    decodedUrl += 'index.html';
  }

  let filePath = path.join(BASE_DIR, decodedUrl);

  // Prevenir Directory Traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Prohibido');
    return;
  }

  // Si la ruta es un directorio, buscar index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><title>404 No Encontrado</title>
        <style>body{font-family:sans-serif;padding:40px;background:#0f172a;color:white;text-align:center;}</style></head>
        <body>
          <h1>404 - Archivo No Encontrado</h1>
          <p>No se encontró la ruta: <code>${req.url}</code></p>
          <p><a href="/" style="color:#fbbf24;">&larr; Volver al Gestor de Envíos</a> | <a href="/paginas_web/" style="color:#fbbf24;">Ver Páginas Clonadas &rarr;</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor local activo en http://localhost:${PORT}`);
  console.log(`- Gestor de Envíos: http://localhost:${PORT}/`);
  console.log(`- Páginas Clonadas: http://localhost:${PORT}/paginas_web/`);
});
