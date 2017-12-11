import { ServerResponse } from 'http';

export function addCorsHeaders(res: ServerResponse, origins: string[], requestOrigin: string | undefined) {
  const permittedOrigin = requestOrigin === undefined || origins.indexOf(requestOrigin) === -1 ? origins[0] : requestOrigin;
  res.setHeader('Access-Control-Allow-Origin', permittedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
}
