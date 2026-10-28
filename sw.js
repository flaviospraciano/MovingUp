// Service worker do Moving Up: funcionamento offline e notificações.
const CACHE="mu-v5";
const ARQUIVOS=["./","index.html","moving-up.webmanifest","mu-logo.svg","mu-icon-192.png","mu-icon-512.png","mu-maskable-512.png","mu-apple-touch.png","config.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(l=>l.length?l[0].focus():self.clients.openWindow("./")));});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  if(req.mode==="navigate"){e.respondWith(fetch(req,{cache:"no-cache"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put("index.html",c));return r;}).catch(()=>caches.match("index.html")));return;}
  if(u.origin===location.origin&&u.pathname.endsWith("config.js")){e.respondWith(fetch(req,{cache:"no-cache"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put("config.js",c));return r;}).catch(()=>caches.match("config.js")));return;}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(resp=>{if(resp.ok&&(u.origin===location.origin||/(fonts\.googleapis|fonts\.gstatic|www\.gstatic)\.com$/.test(u.hostname))){const c=resp.clone();caches.open(CACHE).then(x=>x.put(req,c));}return resp;})));});
