importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')
workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
)
const cacheName = 'js13kPWA-v1';
const appShellFiles = [
  '',
  '/journal/about.html',
  '/index.html',
  '/journal/journalHome.html',
  '/journal/signin.html',
  '/journal/signup.html',
  '/journal/userWelcome.html',
  'src/app.js',
  'src/prompt.js',
  '/style/style.css',
  '/css/about.css',
  'https://kit.fontawesome.com/0995f9dee8.js',

];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(appShellFiles);
    })());
});

self.addEventListener("fetch", (event)=>{
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request)
        })
    )
})
self.addEventListener("fetch", (event)=>{
    if (event.request.mode === 'navigate') {
        return event.respondWith(
          fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        );
      }
})





