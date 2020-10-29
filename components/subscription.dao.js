const tables = require('../config/tables');

const db = require('postgresorm');

module.exports = {
    addServiceSubscription: function(chat_id, service) {
        let querytext = `INSERT INTO ${ tables.serviceSub }
            (chat_id, service)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING`;

        const values = [chat_id, service];

        return db.customquery(querytext, values)
        .then(res => res.rows);
    },
    fetchServiceSubscription: function(chat_id, service) {
        return db.findone(tables.serviceSub, {chat_id, service});
    }
}
