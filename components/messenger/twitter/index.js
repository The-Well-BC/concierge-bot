const parseMessage = require('./parseMessage');
const prepareMessage = require('./prepareMessage');
const sendMessage = require('./sendMessage');

module.exports = {
    parseMessage,
    prepareMessage,

    format: 'plain',

    sendMessage
}
