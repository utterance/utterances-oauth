"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var https_1 = require("https");
var url_1 = require("url");
function request(args) {
    return new Promise(function (resolve, reject) {
        var processResponse = function (response) {
            var data = '';
            response.on('data', function (chunk) { return data += chunk; });
            response.on('end', function () {
                var status = response.statusCode;
                if (status !== undefined && status >= 200 && status < 300) {
                    resolve(data);
                }
                else {
                    reject(data);
                }
            });
            response.on('error', function (err) { return reject(err); });
        };
        var _a = url_1.parse(args.url), protocol = _a.protocol, hostname = _a.hostname, port = _a.port, path = _a.path;
        var method = args.method, headers = args.headers, body = args.body;
        var requestOptions = { method: method, hostname: hostname, port: port, path: path, headers: headers };
        var hasBody = method === 'POST' && body !== undefined;
        if (hasBody) {
            headers['Content-Length'] = Buffer.byteLength(body).toString(10);
        }
        var request = protocol === 'http:' ? http_1.request(requestOptions, processResponse) : https_1.request(requestOptions, processResponse);
        if (hasBody) {
            request.write(body);
        }
        request.end();
    });
}
exports.request = request;
function getBody(req) {
    return new Promise(function (resolve, reject) {
        var data = '';
        req.on('data', function (chunk) { return data += chunk; });
        req.on('end', function () { return resolve(data); });
        req.on('error', reject);
    });
}
exports.getBody = getBody;
