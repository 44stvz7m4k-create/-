const NYAMI_CACHE = "nyami-v63-stable-pack";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./offline.html",
  "./style.css",
  "./app.js",
  "./auth-v47.css",
  "./auth-v47.js",
  "./admin-v48.js",
  "./server-tracks-v48.css",
  "./server-tracks-v48.js",
  "./universal-search-v54.css",
  "./universal-search-v54.js",
  "./social-auth-v57.css",
  "./social-auth-v57.js",
  "./server-playlists-v58.css",
  "./server-playlists-v58.js",
  "./admin-tools-v59.css",
  "./admin-tools-v59.js",
  "./product-polish-v59.css",
  "./product-polish-v59.js",
  "./queue-history-v60.css",
  "./queue-history-v60.js",
  "./mobile-logo-v61.css",
  "./logo-home-v61.js",
  "./release-pack-v62.css",
  "./release-pack-v62.js",
  "./stable-pack-v63.css",
  "./stable-pack-v63.js",
  "./manifest.webmanifest",
  "./assets/logo/nyami-logo-v61.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(NYAMI_CACHE).then((cache) => cache.addAll(STATIC_FILES).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== NYAMI_CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cached) => {
        return cached || caches.match("./index.html") || caches.match("./offline.html");
      });
    })
  );
});
