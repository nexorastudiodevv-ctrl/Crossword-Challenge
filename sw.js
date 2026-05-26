const CACHE_NAME = 'neon-games-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './xo-worker.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/images/splash.e.jpg'
];

// تثبيت عامل الخدمة وتخزين الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// استراتيجية استرجاع الملفات: ذاكرة التخزين أولاً ثم الشبكة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// تحديث عامل الخدمة وحذف الذاكرة القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});