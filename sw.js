// Cache apenas dos arquivos estáticos próprios; nunca cachear respostas de autenticação ou dados do Supabase.
const CACHE='meu-journal-shell-v6-2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('meu-journal-shell-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;event.respondWith(fetch(req).then(response=>{if(response.ok&&url.pathname.match(/\.(?:html|webmanifest|png)$/)){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return response}).catch(()=>caches.match(req).then(cached=>cached||Response.error())))});
