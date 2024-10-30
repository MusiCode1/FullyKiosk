const workerURL = 'https://musicode1.github.io/FullyKiosk/external-traffic-redirection/service-worker.js' | '/service-worker.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(workerURL)
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}
