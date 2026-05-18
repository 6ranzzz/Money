// 每次改代码，只改这里的版本号，例如 v2 → v3 → v4
const CACHE_VERSION = 'v3';
const CACHE_NAME = 'accounting-app-' + CACHE_VERSION;

// 缓存页面文件
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png'
];

// 安装
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 激活时删除旧缓存（只删代码，不删数据）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 网络优先 + 缓存备用（最安全，不丢数据）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
