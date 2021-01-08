const tables = require('../../config/tables');

const db = require('postgresorm');

const defaultFilterOrder = 'ORDER BY _id ASC';

module.exports = {
    addSubscription: function(chat_id, messenger, filter) {
        let values = [chat_id, messenger];

        let subsQuery = `INSERT INTO ${ tables.subs } (chat_id, messenger) values($1, $2) ON CONFLICT DO NOTHING`;
        let subsParams = [chat_id, messenger];

        return db.customquery(subsQuery, subsParams)
        .then(() => {
            if(filter) {
                if( Array.isArray(filter) ) 
                    throw new Error('Filter should be an object, not array');

                let filterQuery = `INSERT INTO ${ tables.filters } (chat_id, messenger, data) values($1, $2, $3)`;
                let filterParams = [chat_id, messenger, filter];

                return db.customquery(filterQuery, filterParams)
                .then(res => {
                    return res.rows.map(item => {
                        return {
                            chatID: item.chatID,
                            messenger: item.messenger
                        }
                    });
                });
            }
        });
    },

    fetchSubscription: function(chat_id, messenger) {
        let values = [];
        /*
        let querytext = `SELECT s.messenger, s.chat_id, coalesce(filterrows.data, '[]') AS filters
            FROM ${ tables.subscriptions } s
            LEFT JOIN LATERAL (
                SELECT json_agg(f.data) AS data FROM ${ tables.filters } f
                WHERE f.chat_id = s.chat_id AND f.messenger = s.messenger
                ORDER BY _id
            ) filterrows ON true
        `;
        */
        let querytext = `SELECT s.messenger, s.chat_id, coalesce(filterrows.data, '[]') AS filters
            FROM ${ tables.subscriptions } s
            LEFT JOIN LATERAL (
                SELECT json_agg(ff.data) as data FROM (
                    SELECT f.data AS data FROM ${ tables.filters } f
                    WHERE f.chat_id = s.chat_id AND f.messenger = s.messenger
                    ORDER BY _id
                ) ff
            ) filterrows ON true
        `;

        if(chat_id || messenger)
            querytext += ' WHERE ';

        if(chat_id) {
            values.push(chat_id);
            querytext += ` s.chat_id = $${ values.length } `;
        }

        if(chat_id && messenger)
            querytext += ' AND ';

        if(messenger) {
            values.push(messenger);
            querytext += ` $${ values.length } = s.messenger`;
        }

        return db.customquery(querytext, values)
        .then(res => {
            return res.rows.map(item => {
                return {
                    messenger: item.messenger,
                    chatID: item.chat_id,
                    filters: item.filters
                }
            });
        });
    },

    updateFilter(chat_id, messenger, filterPos, updatedFilter) {
        let values = [updatedFilter, chat_id, messenger];

        let querytext = `
            UPDATE ${ tables.filters } f
                SET data = $1

                FROM(
                    SELECT s._id as _id FROM ${ tables.filters } s
                    WHERE s.chat_id = $2 AND s.messenger = $3

                    ORDER BY s._id ASC
                    OFFSET ${ filterPos - 1 } LIMIT 1
                ) subquery

                WHERE f._id = subquery._id
                AND f.chat_id = $2 AND f.messenger = $3
        `;

        return db.customquery(querytext, values)
        .then(res => {
            return res.rows.map(item => {
                return {
                    messenger: item.messenger,
                    chatID: item.chat_id,
                    filters: item.filters
                }
            });
        });
    },

    deleteAllFilters(chat_id, messenger) {
        let values = [chat_id, messenger];

        let querytext = `
            DELETE FROM ${ tables.filters } 
                WHERE chat_id = $1 AND messenger = $2
        `;

        return db.customquery(querytext, values)
        .then(res => {
            return true;
        });
    },

    deleteFilter(chat_id, messenger, filterPos) {
        let values = [chat_id, messenger];

        let querytext = `
            DELETE FROM ${ tables.filters } 
                WHERE _id = (
                    SELECT _id  FROM ${ tables.filters} m
                    WHERE chat_id = $1 and messenger = $2
                    OFFSET ${ filterPos - 1} LIMIT 1
                )

                AND chat_id = $1 AND messenger = $2
        `;

        return db.customquery(querytext, values)
        .then(res => {
            return true;
        });
    },

    deleteSubscription(chat_id, messenger) {
        let querytext = `DELETE FROM ${ tables.subs } WHERE chat_id = $1 and messenger = $2`;
        let values = [chat_id, messenger];

        return db.customquery(querytext,values)
        .then(res => {
            return true;
        });
    }
}
