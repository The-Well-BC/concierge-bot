const tables = require('../config/tables');
const db = require('postgresorm');

exports.mochaHooks = {
    beforeEach(){
        db.debug(false);
        let querytext = `TRUNCATE TABLE ${ Object.values(tables)} CASCADE`;
        return db.customquery(querytext);
    }
}
