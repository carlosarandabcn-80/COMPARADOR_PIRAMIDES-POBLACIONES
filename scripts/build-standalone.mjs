import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const target=process.argv[2];
if(!target)throw Error('Indica la ruta del HTML autónomo de salida.');
const data=fs.readFileSync('data/datasets.json','utf8').replace(/</g,'\\u003c');
const modules=['core','io','learning','app'].map(name=>fs.readFileSync(`src/${name}.js`,'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export \{AGES\};?\r?\n/gm,'').replace(/^export /gm,''));
let js=modules.join('\n').replace(/\r\n?/g,'\n');
const load="const response=await fetch('./data/datasets.json');if(!response.ok)throw Error('No se pudo descargar el archivo de datos.');datasets=await response.json();";
if(!js.includes(load))throw Error('El punto de carga cambió; revisar el generador autónomo.');
js=js.replace(load,`datasets=${data};`).replace("if('serviceWorker'in navigator){const scope=", "if(location.protocol.startsWith('http')&&'serviceWorker'in navigator){const scope=");
js='\n'+js+'\n';
const hash=crypto.createHash('sha256').update(js).digest('base64');
const css=fs.readFileSync('src/style.css','utf8');
let html=fs.readFileSync('index.html','utf8');
html=html.replace(/<meta http-equiv="Content-Security-Policy"[^>]+>/,`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">`)
  .replace(/<link rel="icon"[^>]+>/,'')
  .replace('<link rel="stylesheet" href="src/style.css">',`<style>${css}</style>`)
  .replace('<script type="module" src="src/app.js"></script>',`<script defer>${js}</script>`);
// Inline defer se ignora en scripts clásicos: ejecutar tras construir el DOM.
const scriptStart=html.indexOf('<script defer>');
const scriptEnd=html.indexOf('</script>',scriptStart)+9;
const script=html.slice(scriptStart,scriptEnd).replace('<script defer>','<script>');
html=html.slice(0,scriptStart)+html.slice(scriptEnd);
html=html.replace('</body>',script+'\n</body>');
fs.mkdirSync(path.dirname(path.resolve(target)),{recursive:true});
fs.writeFileSync(target,html);
console.log(`HTML autónomo generado: ${target}; ${Buffer.byteLength(html)} bytes; CSP por SHA-256.`);
