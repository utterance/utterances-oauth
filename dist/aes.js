"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var encryptionAlgorithm = 'aes-256-gcm';
function encrypt(text, password) {
    var iv = crypto_1.randomBytes(16);
    var cipher = crypto_1.createCipheriv(encryptionAlgorithm, password, iv);
    var cipherText = cipher.update(text, 'utf8', 'hex');
    cipherText += cipher.final('hex');
    var authTag = cipher.getAuthTag().toString('hex');
    return iv.toString('hex') + authTag + cipherText;
}
exports.encrypt = encrypt;
function decrypt(text, password) {
    if (text.length < 64) {
        throw new Error('invalid cipher text');
    }
    var iv = Buffer.from(text.substr(0, 32), 'hex');
    var authTag = Buffer.from(text.substr(32, 32), 'hex');
    var cipherText = text.substr(64);
    var decipher = crypto_1.createDecipheriv(encryptionAlgorithm, password, iv);
    decipher.setAuthTag(authTag);
    var dec = decipher.update(cipherText, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.decrypt = decrypt;
