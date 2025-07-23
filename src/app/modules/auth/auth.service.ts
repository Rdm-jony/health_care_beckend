import { generateNewAccessTokenByRefreshToken } from "../../utils/createUsersToken"

const getNewAccessToken = async (refreshToken: string) => {
    const accessToken = await generateNewAccessTokenByRefreshToken(refreshToken)
    return {
        accessToken
    }
}

export const authService = {
    getNewAccessToken
}