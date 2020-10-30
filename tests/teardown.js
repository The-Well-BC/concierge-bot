const tables = require('../config/tables');
const db = require('postgresorm');

module.exports = () => {
    console.log('TEARDOWN');
    db.debug(false);
    let querytext = `TRUNCATE TABLE ${ Object.values(tables)} CASCADE`;
    return db.customquery(querytext);
}
