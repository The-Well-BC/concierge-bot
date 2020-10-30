const tables = require('../config/tables');

const db = require('postgresorm');

module.exports = {
    addServiceSubscription: function(chat_id, service) {
        console.log('ADDINGSERVICE SUb', service);
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
    },

    fetchServiceSubscriptions: function(service) {
        return db.list(tables.serviceSub, {service});
    },

    fetchUserSubscriptions: function(chat_id) {
        return db.list(tables.serviceSub, {chat_id});
    },

    fetchServiceItemSubs: function(payload) {
        if( !payload.service || !payload.item )
            throw new Error('Service and/or item not supplied');

        const { service, item } = payload;

        let chatIDs = [];
        return db.list(tables.serviceSub, {service})
        .then(res => {
            chatIDs = res.map(o => o.chat_id);
            let querytext = `
                SELECT chat_id from ${ tables.itemSub } s
                WHERE item = $1
            `;

            if(chatIDs.length > 0) 
                querytext += `AND chat_id <> ALL(ARRAY[${ chatIDs }])`;
            return db.customquery(querytext, [ item ]);
        }).then(res => {
            let newIDs = res.rows.map(o => o.chat_id);
            chatIDs.push(...newIDs);
            return chatIDs;
        });
    },

    fetchItemSubscription: function(chat_id, item) {
        return db.findone(tables.itemSub, {chat_id, item});
    },

    fetchItemSubscriptions: function(item) {
        return db.list(tables.itemSub, {item});
    },

    addItemSubscription: function(chat_id, item) {
        let querytext = `INSERT INTO ${ tables.items }
            (chat_id, item)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING`;

        const values = [chat_id, item];

        return db.customquery(querytext, values)
        .then(res => res.rows);
    }
}
