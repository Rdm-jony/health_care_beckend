import dotenv from "dotenv"
dotenv.config()

interface EnvConfig {
    DB_URL: string,
    PORT:string,
    NODE_ENV:string,
    BCRYPT_SALT:string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['DB_URL','PORT','NODE_ENV','BCRYPT_SALT']

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        BCRYPT_SALT: process.env.BCRYPT_SALT as string,

    }
}

export const envVars=loadEnvVariables()