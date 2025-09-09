"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    if (matchedArray && matchedArray[1]) {
        return {
            statusCode: 400,
            message: `${matchedArray[1]} already exists!!`
        };
    }
    // Fallback message if pattern not found in error message
    return {
        statusCode: 400,
        message: "Duplicate field value already exists!"
    };
};
exports.handleDuplicateError = handleDuplicateError;
