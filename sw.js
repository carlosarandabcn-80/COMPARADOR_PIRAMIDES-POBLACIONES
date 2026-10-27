// Retira las cachés históricas del comparador. La versión 2 no necesita service worker.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const name of ['piramides-poblacionales-v1','piramides-poblacionales-v2'])await caches.delete(name);
  await self.clients.claim();
  await self.registration.unregister();
})()));
