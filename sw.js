const CACHE='tempo-offline-v10';
const ASSETS=['./','./index.html','./app.js','./offline.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./tempo-offline.html'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('tempo-offline-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).catch(error=>{if(event.request.mode==='navigate')return caches.match('./index.html');throw error})));
});
