import dotenv from "dotenv"
dotenv.config()

interface EnvConfig {
    DB_URL: string,
    PORT:string,
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['DB_URL','PORT']

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string
    }
}

export const envVars=loadEnvVariables()