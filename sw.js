// Quotation Hub service worker — caches the dashboard shell for offline use.
// (The 3 quotation apps themselves load live from GitHub Pages and need internet.)
var CACHE = 'qh-shell-v1';
var SHELL = ['./', './index.html', './manifest.json'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){ return hit || fetch(e.request); }).catch(function(){ return caches.match('./index.html'); })
  );
});
