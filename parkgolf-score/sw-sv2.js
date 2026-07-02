const CACHE = "sv2-cache-v2";
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
  if (url.origin !== location.origin) return;

  // 페이지 문서(HTML) 자체는 "네트워크 우선"으로 바꿈:
  // 온라인이면 항상 최신 sv2.html을 받아오고, 그 결과를 캐시에도 갱신해둔다.
  // 네트워크가 안 될 때(오프라인)만 예전에 저장해둔 캐시로 대체한다.
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // 아이콘 등 나머지 정적 파일은 기존처럼 캐시 우선(빠른 로딩 유지).
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
