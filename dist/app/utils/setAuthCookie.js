export const setAuthCookie = (res, tokens) => {
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
};
