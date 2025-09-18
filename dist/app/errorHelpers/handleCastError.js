export const hendleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id",
    };
};
