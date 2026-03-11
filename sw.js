const CACHE_PREFIX = 'pashucare-';
const CACHE_VERSION = 'v24';
const STATIC_CACHE = `${CACHE_PREFIX}static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${CACHE_VERSION}`;
const APP_SHELL = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './i18n.js',
  './manifest.webmanifest',
  './pashu-icon.svg',
  './rag-status.html'
];

const OPTIONAL_ASSETS = [
  './cow/model.json',
  './cow/metadata.json',
  './cow/weights.bin',
  './libs/tf.min.js',
  './libs/teachablemachine-image.min.js'
];

function isSameOrigin(url) {
  return new URL(url).origin === self.location.origin;
}

function isCacheable(response) {
  return response && response.status === 200 && response.type === 'basic';
}

function isCriticalAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/app.js') ||
    url.pathname.endsWith('/index.css') ||
    url.pathname.endsWith('/i18n.js')
  );
}

function asNoStoreRequest(request) {
  return new Request(request, { cache: 'no-store' });
}

async function networkFirstNavigation(request) {
  try {
    const networkResponse = await fetch(asNoStoreRequest(request));
    if (isCacheable(networkResponse)) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    const offlineShell = await caches.match('./index.html');
    if (offlineShell) return offlineShell;

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  const fetchPromise = fetch(request)
    .then(async networkResponse => {
      if (isCacheable(networkResponse)) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  if (cachedResponse) return cachedResponse;
  const networkResponse = await fetchPromise;
  if (networkResponse) return networkResponse;

  return new Response('', { status: 504, statusText: 'Gateway Timeout' });
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' })));
    await Promise.all(
      OPTIONAL_ASSETS.map(async url => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (isCacheable(response)) {
            await cache.put(url, response.clone());
          }
        } catch (err) {
          // Optional assets may not exist in every deployment.
        }
      })
    );
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const validCaches = new Set([STATIC_CACHE, RUNTIME_CACHE]);
    await Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && !validCaches.has(key))
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  if (!isSameOrigin(request.url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isCriticalAsset(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
