const sendDM = require('./api/sendDM');

module.exports = (messageArr, chatIDs) => {
    return sendDM(messageArr[0][0])
}
