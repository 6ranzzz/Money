const CACHE_NAME = 'minimal-money-v1';
// 需要缓存的资源列表（包含网页本身和在线的 React 库）
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// 安装时：把所有东西存进手机
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 激活时：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 发起请求时：优先使用手机本地缓存，没网也能开
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 非同源且不在 ASSETS 里的外部请求，直接放行不缓存
  if (url.origin !== location.origin && !ASSETS.includes(e.request.url)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
