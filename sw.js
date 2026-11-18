const CACHE="reto-antsoain-v6";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);
  // la página siempre se pide a internet (así llegan las versiones nuevas); sin conexión, se usa la guardada
  if(req.mode==="navigate"||(url.origin===location.origin&&url.pathname.endsWith(".html"))){
    e.respondWith(fetch(req,{cache:"no-store"}).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put("./index.html",c))}return res}).catch(()=>caches.match("./index.html")));return}
  if(url.hostname.endsWith("supabase.co"))return;
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
    if(res.ok&&(url.origin===location.origin||url.hostname.endsWith("gstatic.com")||url.hostname.endsWith("googleapis.com")||url.hostname==="cdn.jsdelivr.net")){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}
    return res;
  })));
});
