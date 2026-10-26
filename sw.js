/* Caché acotada a este repositorio. Navegación: preferir red para evitar versiones obsoletas. */
const CACHE_NAME="demografia-lab-v3-20261026";
const PREFIX="demografia-lab-";
const CORE=["./","./index.html","./laboratorio.html","./comparador-original.html","./assets/laboratorio.css","./assets/demografia-core.js","./assets/laboratorio.js","./assets/favicon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
 const req=event.request,url=new URL(req.url),scope=new URL(self.registration.scope);
 if(req.method!=="GET"||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(req.mode==="navigate"){
  event.respondWith(fetch(req).then(res=>{if(res.ok){const clone=res.clone();event.waitUntil(caches.open(CACHE_NAME).then(c=>c.put(req,clone)));}return res;}).catch(async()=>await caches.match(req)||await caches.match("./index.html")));
  return;
 }
 event.respondWith(caches.match(req).then(async cached=>cached||fetch(req).then(res=>{if(res.ok){const clone=res.clone();event.waitUntil(caches.open(CACHE_NAME).then(c=>c.put(req,clone)));}return res;})));
});