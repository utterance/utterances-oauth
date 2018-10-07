"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var querystring_1 = require("querystring");
var request_1 = require("./request");
var state_1 = require("./state");
var cors_1 = require("./cors");
var authorizeUrl = 'https://github.com/login/oauth/authorize';
var accessTokenUrl = 'https://github.com/login/oauth/access_token';
function routeRequest(settings, req, res) {
    var url = url_1.parse(req.url, true);
    var pathname = url.pathname;
    var query = url.query;
    var base_path = settings.base_path;
    applySecurityPolicy(res);
    if (req.method === 'OPTIONS') {
        cors_1.addCorsHeaders(res, settings.origins, req.headers.origin);
        res.writeHead(200);
        res.end();
    }
    else if (req.method === 'GET' && (pathname === '' || pathname === '/' || pathname === base_path || pathname === base_path + '/')) {
        res.writeHead(200);
        res.write('alive');
        res.end();
    }
    else if (req.method === 'GET' && pathname === base_path + '/authorize') {
        authorizeRequestHandler(settings, query, res);
    }
    else if (req.method === 'GET' && pathname === base_path + '/authorized') {
        authorizedRequestHandler(settings, query, res);
    }
    else if (req.method === 'GET' && pathname === base_path + '/token') {
        cors_1.addCorsHeaders(res, settings.origins, req.headers.origin);
        tokenRequestHandler(settings, query, res);
    }
    else if (req.method === 'POST' && pathname.startsWith(base_path) && /^\/repos\/[\w-_]+\/[\w-_.]+\/issues$/i.test(pathname.substr(base_path.length))) {
        cors_1.addCorsHeaders(res, settings.origins, req.headers.origin);
        postIssueRequestHandler(settings, pathname.substr(base_path.length), req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("Not Found: " + pathname);
        res.end();
    }
}
exports.routeRequest = routeRequest;
function applySecurityPolicy(res) {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}
function badRequest(res, message) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write(message);
    res.end();
}
function authorizeRequestHandler(settings, query, res) {
    return __awaiter(this, void 0, void 0, function () {
        var origins, client_id, state_password, app_root, appReturnUrl, state, redirect_uri;
        return __generator(this, function (_a) {
            origins = settings.origins, client_id = settings.client_id, state_password = settings.state_password, app_root = settings.app_root;
            appReturnUrl = query.redirect_uri;
            if (!appReturnUrl || Array.isArray(appReturnUrl) || !origins.find(function (origin) { return appReturnUrl.indexOf(origin) === 0; })) {
                badRequest(res, "\"redirect_uri\" is required and must match the following origins: \"" + origins.join('", "') + "\".");
                return [2];
            }
            state = state_1.encodeState(appReturnUrl, state_password);
            redirect_uri = app_root + '/authorized';
            res.writeHead(302, { Location: authorizeUrl + "?" + querystring_1.stringify({ client_id: client_id, redirect_uri: redirect_uri, state: state }) });
            res.end();
            return [2];
        });
    });
}
function authorizedRequestHandler(settings, query, res) {
    return __awaiter(this, void 0, void 0, function () {
        var code, state, client_id, client_secret, state_password, user_agent, secure_cookie, docsReturnUrl, args, accessToken, _a, _b, err_1, encodedState;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    code = query.code, state = query.state;
                    if (!code || Array.isArray(code)) {
                        badRequest(res, '"code" is required.');
                        return [2];
                    }
                    if (!state || Array.isArray(state)) {
                        badRequest(res, '"state" is required.');
                        return [2];
                    }
                    client_id = settings.client_id, client_secret = settings.client_secret, state_password = settings.state_password, user_agent = settings.user_agent, secure_cookie = settings.secure_cookie;
                    docsReturnUrl = state_1.tryDecodeState(state, state_password);
                    if (docsReturnUrl instanceof Error) {
                        badRequest(res, docsReturnUrl.message);
                        return [2];
                    }
                    args = {
                        url: accessTokenUrl,
                        method: 'POST',
                        body: querystring_1.stringify({ client_id: client_id, client_secret: client_secret, code: code, state: state }),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': user_agent
                        }
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    _b = (_a = JSON).parse;
                    return [4, request_1.request(args)];
                case 2:
                    accessToken = _b.apply(_a, [_c.sent()]).access_token;
                    return [3, 4];
                case 3:
                    err_1 = _c.sent();
                    res.writeHead(503, 'Unable to load token from GitHub.', { 'Set-Cookie': "state=;" + (secure_cookie ? 'Secure;' : '') + "HttpOnly;Max-Age=0;Path=/token" });
                    res.end();
                    return [2];
                case 4:
                    encodedState = state_1.encodeState(accessToken, state_password);
                    res.writeHead(302, { 'Location': docsReturnUrl + '?state=' + encodedState });
                    res.end();
                    return [2];
            }
        });
    });
}
function tokenRequestHandler(settings, query, res) {
    var state = query.state;
    if (!state || Array.isArray(state)) {
        badRequest(res, '"state" is required.');
        return;
    }
    var accessToken = state_1.tryDecodeState(state, settings.state_password);
    if (accessToken instanceof Error) {
        badRequest(res, accessToken.message);
        return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(accessToken));
    res.end();
}
function postIssueRequestHandler(settings, path, req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, err_2, authorization, authArgs, err_3, args, json, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, request_1.getBody(req)];
                case 1:
                    body = _a.sent();
                    return [3, 3];
                case 2:
                    err_2 = _a.sent();
                    badRequest(res, 'Unable to read request.');
                    return [2];
                case 3:
                    authorization = req.headers.authorization;
                    if (authorization === undefined || Array.isArray(authorization)) {
                        badRequest(res, 'Authorization header is required.');
                        return [2];
                    }
                    authArgs = {
                        url: "https://api.github.com/user",
                        method: 'GET',
                        headers: {
                            'Authorization': authorization,
                            'User-Agent': settings.user_agent
                        }
                    };
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4, request_1.request(authArgs)];
                case 5:
                    _a.sent();
                    return [3, 7];
                case 6:
                    err_3 = _a.sent();
                    res.writeHead(401, 'Not Authorized');
                    res.end();
                    return [2];
                case 7:
                    args = {
                        url: "https://api.github.com" + path,
                        method: 'POST',
                        headers: {
                            'Authorization': 'token ' + settings.bot_token,
                            'User-Agent': settings.user_agent
                        },
                        body: body
                    };
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4, request_1.request(args)];
                case 9:
                    json = _a.sent();
                    res.writeHead(200);
                    res.write(json);
                    return [3, 11];
                case 10:
                    err_4 = _a.sent();
                    res.writeHead(503, 'Unable to post issue to GitHub.');
                    return [3, 11];
                case 11:
                    res.end();
                    return [2];
            }
        });
    });
}
