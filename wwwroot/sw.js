const CACHE = 'cache-and-update';

const cacheWhitList = [''];

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function (evt) {
    return evt.respondWith(fetch(evt.request));
    // console.log('The service worker is serving the asset.');
    // if (evt.request.url === "http://localhost:5000/") {
    //     evt.waitUntil(precachePaginas());
    // }
    // evt.respondWith(fromCache(evt.request));
    // evt.waitUntil(update(evt.request));
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
        return cache.addAll([
            new Request('/Home/Privacy', { credentials: "include" })
        ]);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching;
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