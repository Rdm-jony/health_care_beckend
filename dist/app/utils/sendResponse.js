export const sendResponse = (res, data) => {
    return res.status(data.statusCode).json({
        data: data.data,
        message: data.message,
        statusCode: data.statusCode,
        success: data.success,
        meta: data.meta
    });
};
