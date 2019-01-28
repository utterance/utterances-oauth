interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
  waitUntil(f: Promise<any>): void;
}
