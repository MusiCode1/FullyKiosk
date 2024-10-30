const thisHost = (new URL(self.registration.scope)).origin;

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // בדיקה אם ה-URL לא מתחיל ב-127.0.0.1:3002
    if (!requestUrl.origin.startsWith(thisHost)) {
        // המרת הכתובת המקומית לכתובת היעד החדשה
        const newUrl = thisHost + '/' + requestUrl.host + requestUrl.pathname + requestUrl.search;

        // החלפת הבקשה המקורית בבקשה החדשה
        event.respondWith(fetch(newUrl, {
            method: event.request.method,
            headers: event.request.headers,
            body: event.request.body,
            mode: event.request.mode,
            credentials: event.request.credentials,
            cache: event.request.cache,
            redirect: event.request.redirect,
            referrer: event.request.referrer,
            integrity: event.request.integrity
        }));
    }
});
