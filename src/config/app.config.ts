export default (() => ({
    environment: process.env.NODE_ENV,
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    apiKey: process.env.API_KEY,
}));