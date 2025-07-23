import dotenv from "dotenv"
dotenv.config()

interface EnvConfig {
    DB_URL: string,
    PORT: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SALT: string,
    EXPRESS_SESSION_SECRET:string,
    JWT_ACCESS_TOKEN_SECRET: string,
    JWT_ACCESS_TOKEN_EXPIRESIN: string,
    JWT_REFRESH_TOKEN_SECRET: string,
    JWT_REFRESH_TOKEN_EXPIRESIN: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['DB_URL', 'PORT', 'NODE_ENV', 'BCRYPT_SALT', 'JWT_ACCESS_TOKEN_SECRET',
        'JWT_ACCESS_TOKEN_EXPIRESIN', "JWT_REFRESH_TOKEN_SECRET",
        "JWT_REFRESH_TOKEN_EXPIRESIN","EXPRESS_SESSION_SECRET"]

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as EnvConfig["NODE_ENV"],
        BCRYPT_SALT: process.env.BCRYPT_SALT as string,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
        JWT_ACCESS_TOKEN_EXPIRESIN: process.env.JWT_ACCESS_TOKEN_EXPIRESIN as string,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
        JWT_REFRESH_TOKEN_EXPIRESIN: process.env.JWT_REFRESH_TOKEN_EXPIRESIN as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,

    }
}

export const envVars = loadEnvVariables()