/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDuplicateError = (err) => {
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
