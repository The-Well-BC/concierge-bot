module.exports = {
    database: {
        connection: {
            connectionString: `postgresql://concierge_bot:${ process.env.DBPASSWORD }@localhost:5432/concierge_bot`
        }
    }
}

