module.exports = {
    database: {
        connection: {
            connectionString: `postgresql://tradedrop_bot:${ process.env.DBPASSWORD }@localhost:5432/tradedrop_bot`
        }
    },
    cors: {
        origin: ['http://localhost:8000', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
        credentials: true
    }
}

