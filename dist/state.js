"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aes_1 = require("./aes");
var validityPeriod = 5 * 60 * 1000;
function encodeState(value, password) {
    var state = { value: value, expires: Date.now() + validityPeriod };
    return aes_1.encrypt(JSON.stringify(state), password);
}
exports.encodeState = encodeState;
var invalidError = new Error('state is invalid');
var expiredError = new Error('state is expired');
function tryDecodeState(encryptedState, password) {
    var state;
    try {
        state = JSON.parse(aes_1.decrypt(encryptedState, password));
    }
    catch (err) {
        return invalidError;
    }
    if (Date.now() > state.expires) {
        return expiredError;
    }
    return state.value;
}
exports.tryDecodeState = tryDecodeState;
