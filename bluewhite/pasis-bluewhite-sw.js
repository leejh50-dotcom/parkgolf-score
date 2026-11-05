/* PASIS BLUEWHITE PWA service worker
   Firebase 데이터와 HTML을 캐시하지 않습니다. */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
