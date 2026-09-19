import { precacheAndRoute } from 'workbox-precaching';

// Precarga todos los archivos compilados que Vite-plugin-PWA inyecta aquí.
precacheAndRoute(self.__WB_MANIFEST || []);

// Manejo de eventos Push para notificaciones en segundo plano
self.addEventListener('push', function(event) {
  let data = { title: 'Alerta de Mantenimiento', body: 'Revisión técnica requerida en la planta.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
