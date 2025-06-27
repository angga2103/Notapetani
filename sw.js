const CACHE_NAME = 'nota-petani-cache-v1';
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-192x192.png',
  'icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Langkah 1: Install - Menyimpan aset ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// Langkah 2: Fetch - Menyajikan aset dari cache jika tersedia (mode offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, langsung berikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, coba ambil dari internet seperti biasa
        return fetch(event.request);
      }
    )
  );
});

// Langkah 3: Activate - Membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
