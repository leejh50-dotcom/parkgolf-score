const CACHE = "sv2-cache-v1";
const ASSETS = [
  "/parkgolf-score/sv2.html",
  "/parkgolf-score/manifest-sv2.json",
  "/parkgolf-score/sv2-180.png",
  "/parkgolf-score/sv2-192.png",
  "/parkgolf-score/sv2-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
  }
});
