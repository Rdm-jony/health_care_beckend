export const handleZodError = (err) => {
    const errorSources = [];
    err.issues.forEach((issue) => {
        errorSources.push({
            //path : "nickname iside lastname inside name"
            // path: issue.path.length > 1 && issue.path.reverse().join(" inside "),
            path: issue.path[issue.path.length - 1],
            message: issue.message
        });
    });
    return {
        message: "Zod Error",
        errorSources,
        statusCode: 400
    };
};
