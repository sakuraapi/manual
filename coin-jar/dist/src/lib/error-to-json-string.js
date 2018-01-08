"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorToJsonString(err) {
    return JSON.stringify(err, ['message', 'arguments', 'type', 'name', 'stack']);
}
exports.errorToJsonString = errorToJsonString;
//# sourceMappingURL=error-to-json-string.js.map