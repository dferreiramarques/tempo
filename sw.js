const CACHE='tempo-offline-v11';
const ASSETS=['./','./index.html','./app.js','./offline.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./tempo-offline.html','./tempo-icon.svg?v=20261104','./icon-192.png?v=20261104','./icon-512.png?v=20261104','./icon-maskable-512.png?v=20261104'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('tempo-offline-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(new URL(event.request.url).pathname===new URL('./manifest.webmanifest',self.location).pathname){
  event.respondWith(fetch(new Request(event.request,{cache:'no-cache'})).then(response=>{if(!response.ok)throw new Error('Manifest unavailable');return response;}).catch(()=>caches.open(CACHE).then(cache=>cache.match('./manifest.webmanifest'))));return;
 }
 event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(cached=>cached||fetch(event.request).catch(error=>{if(event.request.mode==='navigate')return caches.match('./index.html');throw error})));
});


