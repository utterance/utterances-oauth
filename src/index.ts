import { processRequest } from './routes';

addEventListener('fetch', e => {
  // work around as strict typescript check doesn't allow e to be of type FetchEvent
  const fe = e as FetchEvent
  fe.respondWith(processRequest(fe));
});
