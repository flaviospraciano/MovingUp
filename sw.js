// Service worker do Moving Up: funciona offline, atualiza em segundo plano e recebe os avisos (push).
// Os arquivos do app abrem na hora a partir do cache e são atualizados em segundo plano:
// uma mudança publicada no GitHub aparece na próxima vez que o app for aberto.
const CACHE="mu-v28";
const APP=["./","index.html","config.js","css/app.css","moving-up.webmanifest","mu-logo.svg","mu-icon-192.png","mu-icon-512.png","mu-maskable-512.png","mu-apple-touch.png",
  ...["01-base","02-modulos","03-nuvem","04-ferramentas","05-produtividade","06-kegel","07-curso","08-atabaque","09-violao","10-pro","11-gratidao",
      "12-icones","20-ciclo","21-contatos","22-feynman","23-compromisso","24-carta","25-inicio","26-jarvis","27-voz","28-contas","29-foto","30-push","31-maratona","32-resistencia","33-meditacao","34-portugues","35-voz-entrada","36-leitores","37-chave","38-rapido","39-ao-vivo","99-iniciar"].map(f=>"js/"+f+".js")];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});

/* abre do cache e atualiza em segundo plano */
function doCacheEAtualiza(e,chave){const rede=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(chave||e.request,c));}return r;});
  e.waitUntil(rede.catch(()=>{}));return caches.match(chave||e.request,{ignoreSearch:true}).then(r=>r||rede);}
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  if(req.mode==="navigate"){e.respondWith(doCacheEAtualiza(e,"index.html").catch(()=>caches.match("index.html")));return;}
  if(u.origin===location.origin){
    if(u.pathname.includes("/assets/")){ /* sons do violão: não mudam, cache permanente */
      e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{if(resp.ok){const c=resp.clone();caches.open(CACHE).then(x=>x.put(req,c));}return resp;})));return;}
    e.respondWith(doCacheEAtualiza(e));return;}
  if(/(fonts\.googleapis|fonts\.gstatic|www\.gstatic|cdnjs\.cloudflare|cdn\.jsdelivr)\.(com|net)$/.test(u.hostname)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{if(resp.ok){const c=resp.clone();caches.open(CACHE).then(x=>x.put(req,c));}return resp;})));}});

/* ---------- avisos com o app fechado ---------- */
self.addEventListener("push",e=>{let p={};try{p=e.data?e.data.json():{};}catch(x){p={data:{title:"Moving Up",body:e.data?e.data.text():""}};}
  const d=p.data||p,n=p.notification||{};
  e.waitUntil(self.registration.showNotification(d.title||n.title||"Moving Up",{body:d.body||n.body||"",icon:"mu-icon-192.png",badge:"mu-icon-192.png",
    tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||"./"},vibrate:[120,60,120]}));});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||"./";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l){if("focus" in c)return c.focus();}return self.clients.openWindow(url);}));});
