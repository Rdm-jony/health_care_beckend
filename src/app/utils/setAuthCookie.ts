import { Response } from "express"

interface AuthToken {
    accessToken?: string,
    refreshToken?: string
}
export const setAuthCookie = (res: Response, tokens: AuthToken) => {
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: false
        })
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false
        })
    }
}
