const CACHE="financeiro-sitio-v12-13";
const ASSETS=[
  "./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png",
  "./assistant-v123.css","./assistant-v123.js","./v127.css","./v127.js",
  "./v1210.css","./v1210.js","./v1211.css","./v1212.css","./v1213.css","./cotacao.json"
];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin===self.location.origin){
    event.respondWith(
      fetch(event.request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
          return response;
        })
        .catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html")))
    );
  }
});
