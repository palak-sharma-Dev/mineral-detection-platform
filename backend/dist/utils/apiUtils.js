"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonParse = safeJsonParse;
function safeJsonParse(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
