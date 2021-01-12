const invalidPlatform = require('../errorMessages')

module.exports = (err, messenger) => {
    return invalidPlatform(err, messenger);
}

