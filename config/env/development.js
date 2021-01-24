module.exports = {
    database: {
        connection: {
            connectionString: `postgresql://tradedrop_bot:${ process.env.DBPASSWORD }@localhost:5432/tradedrop_bot`
        }
    }
}

