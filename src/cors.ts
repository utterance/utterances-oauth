export function addCorsHeaders(res: Response, origins: string[], requestOrigin: string | null) {
  const permittedOrigin = requestOrigin === null || origins.indexOf(requestOrigin) === -1 ? origins[0] : requestOrigin;
  res.headers.append('Access-Control-Allow-Origin', permittedOrigin);
  res.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append('Access-Control-Max-Age', '86400'); // 24 hours
  res.headers.append('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, label');
}
