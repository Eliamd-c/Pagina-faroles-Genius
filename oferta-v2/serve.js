const http=require('http'),fs=require('fs'),p=require('path');
const dir=__dirname;
http.createServer((q,r)=>{
  const ruta=decodeURIComponent(q.url.split('?')[0]);
  const f=p.join(dir, ruta==='/'?'recorrido.html':ruta);
  fs.readFile(f,(e,d)=>{
    if(e){r.writeHead(404);r.end('no');return;}
    r.writeHead(200,{'Content-Type':'text/html; charset=utf-8',
      'Cache-Control':'no-store, no-cache, must-revalidate'});
    r.end(d);});
}).listen(4321,()=>console.log('http://localhost:4321'));
