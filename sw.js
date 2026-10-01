const CACHE = 'android-field-guide-v5';
const STUDY_GUIDE = './docs/study-guides/kotlin-coroutines-study-guide.pdf';
const ASSETS = ['./','./index.html','./styles.css?v=5','./app.js?v=5','./content-kotlin.js?v=5','./content-android.js?v=5','./content-design-extra.js?v=5','./content-interview-extra.js?v=5','./content-kotlin-review.js?v=5','./content-android-review.js?v=5','./content-design-review.js?v=5','./icon.svg','./manifest.webmanifest',STUDY_GUIDE];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('android-field-guide-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.href===new URL(STUDY_GUIDE,self.registration.scope).href) {event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));return;}
 if(event.request.mode==='navigate') {event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 if(ASSETS.some(asset=>new URL(asset,self.registration.scope).href===url.href)) event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
