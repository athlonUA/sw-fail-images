this.addEventListener('install', e => {
    e.waitUntil(
        caches.open('precache').then(cache => cache.add('/broken.png'))
    );
});

function isImage(fetchRequest) {
    return (
        fetchRequest.method === 'GET' && fetchRequest.destination === 'image'
    );
}

this.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(response => {
                if (response.ok) return response;

                // User is online, but response was not ok
                if (isImage(e.request)) {
                    // Get broken image placeholder from cache
                    return caches.match('/broken.png');
                }
            })
            .catch(err => {
                // User is probably offline
                if (isImage(e.request)) {
                    // Get broken image placeholder from cache
                    return caches.match('/broken.png');
                }
            }) // end fetch
    );
});
