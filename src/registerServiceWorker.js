/* eslint-disable no-console */

import { register } from 'register-service-worker'

self.addEventListener('fetch', event => {
    console.log('Fetch of: ', event.request.url);

    event.respondWith(
        // the response is resolved to null if there is no match 
        caches.match(event.request)
        .then(response => {
            var res = response;

            if (!res) {
                console.log('NOT IN CACHE, FETCHED FROM NETWORK!')
                res = fetch(event.request)
            } else {
                console.log('FOUND IN CACHE')
            }
            return res
        })
    );
    event.respondWith(new Response('Hello <b>World</b>', { headers: { 'Content-Type': 'text/html' } }));

})

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n' +
                'For more details, visit https://goo.gl/AFskqB'
            )
        },
        registered() {
            console.log('Service worker has been registered.')
        },
        cached() {
            console.log('Content has been cached for offline use.')
        },
        updatefound() {
            console.log('New content is downloading.')
        },
        updated() {
            console.log('New content is available; please refresh.')
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.')
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        }
    })
}