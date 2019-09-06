const CACHE = 'cache-and-update';
const CACHE_AVAILABLE = 'cache-available';
const cacheWhitList = [''];

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function (evt) {
    if (evt.request.url.toLocaleLowerCase().indexOf("/carregando") !== -1) {
        console.log('Updating page caches');
        evt.waitUntil(precachePaginas());
    }
    return evt.respondWith(fromCache(evt.request));
});

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            '/lib/bootstrap/dist/css/bootstrap.css',
            '/css/site.css',
            '/lib/jquery/dist/jquery.js',
            '/lib/bootstrap/dist/js/bootstrap.bundle.js',
            '/lib/jquery-validation/dist/jquery.validate.js',
            '/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.js'
        ]);
    });
}

function precachePaginas() {
    return caches.open(CACHE).then(function (cache) {
        return caches.delete(CACHE_AVAILABLE).then(() => {
            return cache.addAll([
                new Request('/Home/Privacy', { credentials: "include" }),
                new Request('/Home/Index', { credentials: "include" })
            ]).then(() => caches.open(CACHE_AVAILABLE));
        });
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || fetch(request);
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}