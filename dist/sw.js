
      const CACHE_NAME = 'rutgers-dashboard-v1';
      const urlsToCache = [
        '/',
        '/dist/styles.css',
        '/dist/main.min.js',
        '/static/icons.svg',
        '/dist/rutgers-logo.svg',
        '/dist/user-avatar.svg'
      ];

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
        );
      });

      self.addEventListener('fetch', event => {
        event.respondWith(
          caches.match(event.request)
            .then(response => response || fetch(event.request))
        );
      });
    