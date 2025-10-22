const VERSION = "v1.0.0";
const CACHE_NAME = `campus-watch-${VERSION}`;

const appShell = [
    '/',                     
    '/index.html',           
    '/dashboard.html',       
    '/login.html',            
    '/styles.css',           
    '/app.js',
    'https://cdn.tailwindcss.com'           
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(appShell);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => {
            return res || fetch(event.request);
        })
    );
});

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
});

self.addEventListener('fetch', (event) => {
  console.log('Interceptando fetch para:', event.request.url);
});
