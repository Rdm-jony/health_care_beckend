import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
    const email = payload.email
    const isUserExists = await User.findOne({ email })
    if (isUserExists) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "user already exists!!")
    }
    const hashPassword = bcrypt.hashSync(payload.password as string, parseInt(envVars.BCRYPT_SALT))
    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: email as string
    }
    const user = await User.create({ ...payload, auth: [authProvider], password: hashPassword })
    return user
}

export const userService = {
    createUser
}