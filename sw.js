/* Caché de recursos estáticos del comparador. Nunca devuelve HTML en lugar de JSON/JS. */
const CACHE_NAME = 'piramides-poblacionales-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './payload/index.html.gz.b64',
  './manifest.webmanifest',
  './assets/favicon.svg',
  './assets/og-image.svg'
];
const APP_SCOPE = new URL(self.registration.scope);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith('piramides-poblacionales-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== APP_SCOPE.origin || !url.pathname.startsWith(APP_SCOPE.pathname)) return;

  // La carga principal usa cache:no-store: su caché debe estar gobernada por el navegador.
  // Para permitir uso desconectado del paquete se recurre a una copia precargada
  // exclusivamente cuando falla la red.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const pathname = url.pathname;
    const isPayload = pathname.endsWith('/payload/index.html.gz.b64');
    const isNavigation = request.mode === 'navigate';
    if (isPayload) {
      try {
        const fresh = await fetch(request);
        if (!fresh.ok) throw new Error('Respuesta de carga no válida');
        await cache.put(new URL('./payload/index.html.gz.b64', APP_SCOPE), fresh.clone());
        return fresh;
      } catch (error) {
        const cached = await cache.match(new URL('./payload/index.html.gz.b64', APP_SCOPE));
        if (cached) return cached;
        return Response.error();
      }
    }
    if (isNavigation) {
      try {
        const response = await fetch(request);
        if (response.ok) return response;
      } catch (error) { /* ofrecer HTML offline si existe */ }
      return (await cache.match('./index.html')) || Response.error();
    }
    const cached = await cache.match(request, {ignoreSearch: true});
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
