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
function getAppSettings() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, CLIENT_ID, CLIENT_SECRET, BOT_TOKEN, STATE_PASSWORD, APP_ROOT, ORIGINS, USER_AGENT, client_id, client_secret, bot_token, state_password, _b, app_root, base_path, secure_cookie, origins, user_agent;
        return __generator(this, function (_c) {
            _a = process.env, CLIENT_ID = _a.CLIENT_ID, CLIENT_SECRET = _a.CLIENT_SECRET, BOT_TOKEN = _a.BOT_TOKEN, STATE_PASSWORD = _a.STATE_PASSWORD, APP_ROOT = _a.APP_ROOT, ORIGINS = _a.ORIGINS, USER_AGENT = _a.USER_AGENT;
            console.log("CLIENT_ID: " + CLIENT_ID + "\nHAS CLIENT_SECRET: " + !!CLIENT_SECRET + "\nHAS BOT_TOKEN: " + !!BOT_TOKEN + "\nHAS STATE_PASSWORD: " + !!STATE_PASSWORD + "\nAPP_ROOT: " + APP_ROOT + "\nORIGINS: " + ORIGINS + "\nUSER_AGENT: " + USER_AGENT);
            if (!CLIENT_ID || !CLIENT_SECRET || !BOT_TOKEN || !STATE_PASSWORD || !APP_ROOT || !ORIGINS || !USER_AGENT) {
                throw new Error('missing app settings.');
            }
            client_id = CLIENT_ID;
            client_secret = CLIENT_SECRET;
            bot_token = BOT_TOKEN;
            state_password = STATE_PASSWORD;
            _b = parseAppRoot(APP_ROOT), app_root = _b.app_root, base_path = _b.base_path, secure_cookie = _b.secure_cookie;
            origins = ORIGINS.split(',');
            user_agent = USER_AGENT;
            if (state_password.length !== 32) {
                throw new Error('"state-password" must be 32 characters.');
            }
            return [2, { client_id: client_id, client_secret: client_secret, state_password: state_password, bot_token: bot_token, origins: origins, app_root: app_root, base_path: base_path, user_agent: user_agent, secure_cookie: secure_cookie }];
        });
    });
}
exports.getAppSettings = getAppSettings;
function parseAppRoot(url) {
    var parsed = url_1.parse(url);
    var app_root = parsed.href;
    var base_path = parsed.pathname;
    if (app_root.endsWith('/')) {
        app_root = app_root.substr(0, app_root.length - 1);
    }
    if (base_path.endsWith('/')) {
        base_path = base_path.substr(0, base_path.length - 1);
    }
    var secure_cookie = parsed.protocol === 'https:';
    return { app_root: app_root, base_path: base_path, secure_cookie: secure_cookie };
}
