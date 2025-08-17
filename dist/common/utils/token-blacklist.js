"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRevokedToken = addRevokedToken;
exports.isTokenRevoked = isTokenRevoked;
const revokedTokens = new Set();
function addRevokedToken(token) {
    revokedTokens.add(token);
}
function isTokenRevoked(token) {
    return revokedTokens.has(token);
}
//# sourceMappingURL=token-blacklist.js.map