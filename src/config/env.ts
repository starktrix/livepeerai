import { config as envConfig } from "dotenv"
envConfig()

const config = {
    development: {
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI,
        LIVEPEER_API_KEY: process.env.LIVEPEER_API_KEY,
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        GROQ_API_KEY_SUMMARIZER: process.env.GROQ_API_KEY_SUMMARIZER
    },
    production: {},
    testing: {}
} as Record<string, any>

const ENV: string = `${process.env.ENV}` || "development"
export default config[ENV]