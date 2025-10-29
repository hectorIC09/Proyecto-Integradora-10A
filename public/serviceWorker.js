const VERSION = "v1.0.0";
const CACHE_NAME = `campus-watch-${VERSION}`;

// Rutas corregidas, relativas a la carpeta 'public'
const appShell = [
    '/',
    '/index.html', 
    '/dashboard.html', 
    '/styles.css', 
    '/app.js',
    '/manifest.json'
];

self.addEventListener("install", (event) => {
    console.log('✅ Service Worker: Evento "install" - Intentando cachear App Shell.');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(appShell).then(() => {
                console.log('✅ Service Worker: Todos los recursos App Shell han sido cacheados.');
                // Forzar que el nuevo SW tome el control inmediatamente
                return self.skipWaiting(); 
            }).catch(err => {
                console.error('❌ Service Worker: Error al añadir todos los recursos al caché:', err);
                // Si falla un recurso, puede fallar todo el addAll.
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Evento "activate"');
    // Eliminar cachés antiguos
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Reclamar inmediatamente a todos los clientes (páginas)
            return self.clients.claim(); 
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log('🔄 Service Worker: Interceptando fetch para:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((res) => {
            // Estrategia: Cache, luego Network (primero busca en caché, si no lo encuentra, va a la red)
            return res || fetch(event.request).catch(() => {
                // Opcional: puedes devolver una página de "Offline" si la petición falla
                // if (event.request.mode === 'navigate') {
                //     return caches.match('/offline.html'); 
                // }
            });
        })
    );
});