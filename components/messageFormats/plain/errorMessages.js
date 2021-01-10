const errorMessages = require('../errorMessages');

module.exports = (err, messenger) => {
    return errorMessages(err,messenger);
}


