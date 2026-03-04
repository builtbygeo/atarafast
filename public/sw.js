self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Triggered by push API (server-side push)
self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title ?? 'Atara';
    const options = {
        body: data.body ?? 'Your fast is complete!',
        icon: '/apple-touch-icon.png',
        badge: '/apple-touch-icon.png',
        tag: 'fast-complete',
        renotify: true,
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Triggered from the main thread via postMessage — works on iOS PWA
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SHOW_NOTIFICATION') {
        const { title, body } = event.data;
        self.registration.showNotification(title, {
            body,
            icon: '/apple-touch-icon.png',
            badge: '/apple-touch-icon.png',
            tag: 'fast-complete',
            renotify: true,
        });
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
