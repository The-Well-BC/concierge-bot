const tables = require('../../config/tables');

const db = require('postgresorm');

module.exports = {
    addServiceSubscription: function(chat_id, service, messenger, all) {
        let values = [chat_id, messenger, all];
        let querytext = `INSERT INTO ${ tables.serviceSub } `;
        let updatetext = 'ON CONFLICT (chat_id, messenger) DO UPDATE SET ';

        if(service) {
            querytext += `(chat_id, messenger, all_, service)
                VALUES ($1, $2, $3, $4)
            `;

            updatetext += ' service = array(select distinct unnest(service_subscriptions.service || EXCLUDED.service)), ';

            if( Array.isArray(service) )
                values.push(service);
            else
                values.push( [ service ] );

        } else {
            querytext += `(chat_id, messenger, all_)
                VALUES ($1, $2, $3)
            `;
        }

        updatetext += ' all_ = EXCLUDED.all_';
        querytext += updatetext;

        return db.customquery(querytext, values)
        .then(res => {
            return res.rows.map(item => {
                return {
                    messenger: item.messenger,
                    chat_id: item.chat_id,
                    all: item.all_
                }
            });
        });
    },

    fetchServiceSubscription: function(chat_id, service) {
        let values = [];
        let querytext = `SELECT messenger, chat_id, all_, service FROM ${ tables.serviceSub }
        `;

        if(chat_id || service)
            querytext += ' WHERE ';

        if(chat_id) {
            values.push(chat_id);
            querytext += ` chat_id = $${ values.length } `;
        }

        if(chat_id && service)
            querytext += ' AND ';

        if(service) {
            values.push(service);
            querytext += ` $${ values.length } = any(service)`;
        }

        return db.customquery(querytext, values)
        .then(res => {
            return res.rows.map(item => {
                return {
                    messenger: item.messenger,
                    chat_id: item.chat_id,
                    service: item.service,
                    all: item.all_
                }
            });
        });
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

    addItemSubscription: function(chat_id, item, messenger) {
        let querytext = `INSERT INTO ${ tables.items }
            (chat_id, item, messenger)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING`;

        const values = [chat_id, item, messenger];

        return db.customquery(querytext, values)
        .then(res => res.rows);
    }
}
