const CACHE_NAME = 'ortho-cache-v2';
// Liste des fichiers à sauvegarder pour le mode hors-ligne
const ASSETS = [
  '/SuiviOrthoGoogle/',
  '/SuiviOrthoGoogle/index.html',
  '/SuiviOrthoGoogle/manifest.json',
  '/SuiviOrthoGoogle/icon.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// Installation : on met les fichiers en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activation : on nettoie les vieux caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Stratégie : Network First (on tente le réseau, sinon on prend le cache)
// C'est idéal pour une app qui synchronise des données Firebase
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
