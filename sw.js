const CACHE = 'android-field-guide-v2';
const ASSETS = ['./','./index.html','./styles.css?v=2','./app.js?v=2','./content-kotlin.js?v=2','./content-android.js?v=2','./content-design-extra.js?v=2','./content-interview-extra.js?v=2','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('android-field-guide-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate') {event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 if(ASSETS.some(asset=>new URL(asset,self.registration.scope).href===url.href)) event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
