import { IncomingMessage, request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { parse as parseUrl } from 'url';

export type RequestArgs = {
  url: string;
  method: string;
  body?: string;
  headers: { [name: string]: string; };
}

export function request(args: RequestArgs): Promise<string> {
  return new Promise((resolve, reject) => {
    const processResponse = (response: IncomingMessage) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        const status = response.statusCode;
        if (status !== undefined && status >= 200 && status < 300) {
          resolve(data);
        } else {
          reject(data);
        }
      });
      response.on('error', err => reject(err));
    };

    const { protocol, hostname, port, path } = parseUrl(args.url);
    const { method, headers, body } = args;
    const requestOptions = { method, hostname, port, path, headers };

    const hasBody = method === 'POST' && body !== undefined;
    if (hasBody) {
      headers['Content-Length'] = Buffer.byteLength(body!).toString(10);
    }

    const request = protocol === 'http:' ? httpRequest(requestOptions, processResponse) : httpsRequest(requestOptions, processResponse);

    if (hasBody) {
      request.write(body);
    }

    request.end();
  });
}

export function getBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
