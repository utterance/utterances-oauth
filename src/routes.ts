import { IncomingMessage, ServerResponse } from 'http';
import { parse as parseUrl } from 'url';
import { stringify as stringifyQuery, ParsedUrlQuery } from 'querystring';
import { request, getBody } from './request';
import { AppSettings } from './app-settings';
import { encodeState, tryDecodeState } from './state';
import { addCorsHeaders } from './cors';

const authorizeUrl = 'https://github.com/login/oauth/authorize';
const accessTokenUrl = 'https://github.com/login/oauth/access_token';

export function routeRequest(settings: AppSettings, req: IncomingMessage, res: ServerResponse) {
  const url = parseUrl(req.url as string, true);
  const pathname = url.pathname!;
  const query = url.query as ParsedUrlQuery;
  const base_path = settings.base_path;

  applySecurityPolicy(res);

  if (req.method === 'OPTIONS') {
    addCorsHeaders(res, settings.origins, req.headers.origin as string);
    res.writeHead(200);
    res.end();
  } else if (req.method === 'GET' && (pathname === '' || pathname === '/' || pathname === base_path || pathname === base_path + '/')) {
    res.writeHead(200);
    res.write('alive');
    res.end();
  } else if (req.method === 'GET' && pathname === base_path + '/authorize') {
    authorizeRequestHandler(settings, query, res);
  } else if (req.method === 'GET' && pathname === base_path + '/authorized') {
    authorizedRequestHandler(settings, query, res);
  } else if (req.method === 'GET' && pathname === base_path + '/token') {
    addCorsHeaders(res, settings.origins, req.headers.origin as string);
    tokenRequestHandler(settings, query, res);
  } else if (req.method === 'POST' && pathname.startsWith(base_path) && /^\/repos\/[\w-_]+\/[\w-_.]+\/issues$/i.test(pathname.substr(base_path.length))) {
    addCorsHeaders(res, settings.origins, req.headers.origin as string);
    postIssueRequestHandler(settings, pathname.substr(base_path.length), req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write(`Not Found: ${pathname}`);
    res.end();
  }
}

function applySecurityPolicy(res: ServerResponse) {
  // none of your business who we're powered by.
  res.removeHeader('X-Powered-By');
  // pages are not allowed to be shown in iframes.
  res.setHeader('X-Frame-Options', 'DENY');
  // pages do not have any cross-origin deps on scripts or css.
  res.setHeader('Content-Security-Policy', `default-src 'self'`);
  // don't cache responses.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

function badRequest(res: ServerResponse, message: string) {
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end();
}

async function authorizeRequestHandler(settings: AppSettings, query: ParsedUrlQuery, res: ServerResponse) {
  const { origins, client_id, state_password, app_root } = settings;

  const { redirect_uri: appReturnUrl } = query;

  if (!appReturnUrl || Array.isArray(appReturnUrl) || !origins.find(origin => appReturnUrl.indexOf(origin) === 0)) {
    badRequest(res, `"redirect_uri" is required and must match the following origins: "${origins.join('", "')}".`);
    return;
  }

  const state = encodeState(appReturnUrl, state_password);
  const redirect_uri = app_root + '/authorized';
  res.writeHead(302, { Location: `${authorizeUrl}?${stringifyQuery({ client_id, redirect_uri, state })}` });
  res.end();
}

async function authorizedRequestHandler(settings: AppSettings, query: ParsedUrlQuery, res: ServerResponse) {
  const { code, state } = query;

  if (!code || Array.isArray(code)) {
    badRequest(res, '"code" is required.');
    return;
  }

  if (!state || Array.isArray(state)) {
    badRequest(res, '"state" is required.');
    return;
  }

  const { client_id, client_secret, state_password, user_agent, secure_cookie } = settings;

  const docsReturnUrl = tryDecodeState(state, state_password);
  if (docsReturnUrl instanceof Error) {
    badRequest(res, docsReturnUrl.message)
    return;
  }

  const args = {
    url: accessTokenUrl,
    method: 'POST',
    body: stringifyQuery({ client_id, client_secret, code, state }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': user_agent
    }
  };

  let accessToken: string;
  try {
    accessToken = JSON.parse(await request(args)).access_token;
  }
  catch (err) {
    res.writeHead(503, 'Unable to load token from GitHub.', { 'Set-Cookie': `state=;${secure_cookie ? 'Secure;' : ''}HttpOnly;Max-Age=0;Path=/token` }); // expire the cookie.
    res.end();
    return;
  }

  const encodedState = encodeState(accessToken, state_password);
  res.writeHead(302, { 'Location': docsReturnUrl + '?state=' + encodedState });
  res.end();
}

function tokenRequestHandler(settings: AppSettings, query: ParsedUrlQuery, res: ServerResponse) {
  const { state } = query;

  if (!state || Array.isArray(state)) {
    badRequest(res, '"state" is required.');
    return;
  }

  const accessToken = tryDecodeState(state, settings.state_password);
  if (accessToken instanceof Error) {
    badRequest(res, accessToken.message)
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(accessToken));
  res.end();
}


async function postIssueRequestHandler(settings: AppSettings, path: string, req: IncomingMessage, res: ServerResponse) {
  let body: string;
  try {
    body = await getBody(req);
  } catch (err) {
    badRequest(res, 'Unable to read request.');
    return;
  }

  const authorization = req.headers.authorization;

  if (authorization === undefined || Array.isArray(authorization)) {
    badRequest(res, 'Authorization header is required.');
    return;
  }

  const authArgs = {
    url: `https://api.github.com/user`,
    method: 'GET',
    headers: {
      'Authorization': authorization,
      'User-Agent': settings.user_agent
    }
  };

  try {
    await request(authArgs);
  } catch (err) {
    res.writeHead(401, 'Not Authorized');
    res.end();
    return;
  }

  const args = {
    url: `https://api.github.com${path}`,
    method: 'POST',
    headers: {
      'Authorization': 'token ' + settings.bot_token,
      'User-Agent': settings.user_agent
    },
    body
  }
  try {
    const json = await request(args);
    res.writeHead(200);
    res.write(json);
  } catch (err) {
    res.writeHead(503, 'Unable to post issue to GitHub.');
  }
  res.end();
}
